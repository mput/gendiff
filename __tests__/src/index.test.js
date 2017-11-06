import genDiff from '../../src/';

describe('genDiff compares two JSON files', () => {
  const filePathToBeforeJSON = '__tests__/test_files/before.json';
  const filePathToAfterJSON = '__tests__/test_files/after.json';

  const expectedString =
`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;

  test('should return diff string', () => {
    expect(genDiff(filePathToBeforeJSON, filePathToAfterJSON)).toBe(expectedString);
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
