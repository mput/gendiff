import genDiff from '../src/';

describe('Compares two configuration files', () => {
  const filePathToBeforeJSON = '__tests__/fixtures/before.json';
  const filePathToBeforeYML = '__tests__/fixtures/before.yml';
  const filePathToBeforeINI = '__tests__/fixtures/before.ini';
  const filePathToAfterJSON = '__tests__/fixtures/after.json';
  const filePathToAfterYML = '__tests__/fixtures/after.yml';
  const filePathToAfterINI = '__tests__/fixtures/after.ini';

  const expectedString =
`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;

  test('JSON', () => {
    expect(genDiff(filePathToBeforeJSON, filePathToAfterJSON)).toBe(expectedString);
  });

  test('YML', () => {
    expect(genDiff(filePathToBeforeYML, filePathToAfterYML)).toBe(expectedString);
  });

  test('INI', () => {
    expect(genDiff(filePathToBeforeINI, filePathToAfterINI)).toBe(expectedString);
  });

  const expectedStringBefore =
`{
    host: hexlet.io
    timeout: 50
    proxy: 123.234.53.22
}`;

  test('should return the same config for identical configs', () => {
    expect(genDiff(filePathToBeforeJSON, filePathToBeforeJSON)).toBe(expectedStringBefore);
  });
});


describe('Unsupported markup format', () => {
  const filePathToBeforeXML = '__tests__/fixtures/before.xml';
  test('should throw error', () => {
    expect(() => genDiff(filePathToBeforeXML, filePathToBeforeXML))
      .toThrowError(new Error('Unsupported file format'));
  });
});

