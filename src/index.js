import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const formatParsers = [
  {
    format: '.json',
    parser: JSON.parse,
  },
  {
    format: '.yml',
    parser: yaml.safeLoad,
  },
  {
    format: '.ini',
    parser: ini.parse,
  },
];
const chooseParser = (ext) => {
  const formatParser = _.find(formatParsers, ({ format }) => (format === ext));
  if (!formatParser) {
    throw new Error('Unsupported file format');
  }
  return formatParser.parser;
};

const getObjectFromFile = (pathToFile) => {
  const fileFormat = path.extname(pathToFile);
  const parse = chooseParser(fileFormat);
  const fileStr = fs.readFileSync(pathToFile, 'utf8');
  return parse(fileStr);
};

const hasProp = (object, prop) => Object.prototype.hasOwnProperty.call(object, prop);

const makeDiffs = (firstObject, secondObject) => {
  const mutualKeys = _.union(Object.keys(firstObject), Object.keys(secondObject));
  const diffs = mutualKeys.reduce((acc, key) => {
    if (hasProp(firstObject, key) && !hasProp(secondObject, key)) {
      return [...acc, { key, value: firstObject[key], change: '-' }];
    } else if (!hasProp(firstObject, key) && hasProp(secondObject, key)) {
      return [...acc, { key, value: secondObject[key], change: '+' }];
    } else if (firstObject[key] === secondObject[key]) {
      return [...acc, { key, value: firstObject[key], change: false }];
    }
    return [...acc, { key, value: secondObject[key], change: '+' },
      { key, value: firstObject[key], change: '-' }];
  }, []);
  return diffs;
};

const diffsToString = (diffs) => {
  const diffLines = diffs.map(({ key, value, change }) => {
    const changeFlag = change || ' ';
    return `  ${changeFlag} ${key}: ${value}\n`;
  });
  return `{\n${diffLines.join('')}}`;
};


const genDiff = (pathToFile1, pathToFile2) => {
  const firstObject = getObjectFromFile(pathToFile1);
  const secondObject = getObjectFromFile(pathToFile2);
  const diffs = makeDiffs(firstObject, secondObject);
  const diffsString = diffsToString(diffs);
  return diffsString;
};

export default genDiff;
