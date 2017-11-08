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
  const stringRepresentation =
    {
      changedChild: diff => `  ${spaceCount}  ${diff.key}: ${diffsToString(diff.child, indentation + 4)}\n`,
      unchanged: diff => `  ${spaceCount}  ${diff.key}: ${diff.valueBefore}\n`,
      changed: diff => `  ${spaceCount}+ ${diff.key}: ${diff.valueAfter}\n  ${spaceCount}- ${diff.key}: ${diff.valueBefore}\n`,
      deleted: diff => `  ${spaceCount}- ${diff.key}: ${diff.child ? diffsToString(diff.child, indentation + 4) : diff.valueBefore}\n`,
      added: diff => `  ${spaceCount}+ ${diff.key}: ${diff.child ? diffsToString(diff.child, indentation + 4) : diff.valueAfter}\n`,
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
