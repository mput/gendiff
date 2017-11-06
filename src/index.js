import fs from 'fs';
import _ from 'lodash';
import YAML from 'js-yaml';


const getObjectFromFile = (pathToFile) => {
  const fileFormat = pathToFile.split('.').pop().toLowerCase();
  const fileStr = fs.readFileSync(pathToFile, 'utf8');
  if (fileFormat === 'json') {
    return JSON.parse(fileStr);
  } else if (fileFormat === 'yml') {
    return YAML.safeLoad(fileStr);
  }
  throw new Error('Unsupported file format');
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
