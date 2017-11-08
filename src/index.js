import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import makeDiffsTree from './makeDiffs';

const formatParsers = { '.json': JSON.parse, '.yml': yaml.safeLoad, '.ini': ini.parse };
const chooseParser = (ext) => {
  const formatParser = formatParsers[ext];
  if (!formatParser) {
    throw new Error('Unsupported file format');
  }
  return formatParser;
};

const getObjectFromFile = (pathToFile) => {
  const fileFormat = path.extname(pathToFile);
  const parse = chooseParser(fileFormat);
  const fileStr = fs.readFileSync(pathToFile, 'utf8');
  return parse(fileStr);
};

const diffsToString = (diffs, indentation = 0) => {
  const spaceCount = ' '.repeat(indentation);
  const stringTemplate = (changSign, key, value) => `  ${spaceCount}${changSign} ${key}: ${value}\n`;

  const stringRepresentation =
    {
      changedChild: diff => stringTemplate(' ', diff.key, diffsToString(diff.child, indentation + 4)),
      unchanged: diff => stringTemplate(' ', diff.key, diff.valueBefore),
      changed: diff => [stringTemplate('+', diff.key, diff.valueAfter),
        stringTemplate('-', diff.key, diff.valueBefore)].join(''),
      deleted: (diff) => {
        const value = diff.child ? diffsToString(diff.child, indentation + 4) : diff.valueBefore;
        return stringTemplate('-', diff.key, value);
      },
      added: (diff) => {
        const value = diff.child ? diffsToString(diff.child, indentation + 4) : diff.valueAfter;
        return stringTemplate('+', diff.key, value);
      },
    };
  const diffsString = diffs.map(diff => stringRepresentation[diff.changeType](diff));
  return `{\n${diffsString.join('')}${spaceCount}}`;
};

const genDiff = (pathToFile1, pathToFile2) => {
  const firstObject = getObjectFromFile(pathToFile1);
  const secondObject = getObjectFromFile(pathToFile2);
  const diffsTree = makeDiffsTree(firstObject, secondObject);
  const diffsString = diffsToString(diffsTree);
  return diffsString;
};

export default genDiff;
