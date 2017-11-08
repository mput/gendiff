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


describe('Compares two Recursive files', () => {
  const filePathToBeforeNestedJSON = '__tests__/fixtures/before-nested.json';
  const filePathToAfterNestedJSON = '__tests__/fixtures/after-nested.json';
  const filePathToBeforeNestedINI = '__tests__/fixtures/before-nested.ini';
  const filePathToAfterNestedINI = '__tests__/fixtures/after-nested.ini';
  const expectedString =
`{
    common: {
        setting1: Value 1
      - setting2: 200
        setting3: true
      - setting6: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

  test('JSON-Nested', () => {
    expect(genDiff(filePathToBeforeNestedJSON, filePathToAfterNestedJSON))
      .toBe(expectedString);
  });
  test('INI-Nested', () => {
    expect(genDiff(filePathToBeforeNestedINI, filePathToAfterNestedINI))
      .toBe(expectedString);
  });
});
