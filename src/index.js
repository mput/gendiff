import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import makeDiffsTree from './makeDiffs';
import chooseBuilder from './buildOutput';

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

const genDiff = (pathToFile1, pathToFile2, format) => {
  const firstObject = getObjectFromFile(pathToFile1);
  const secondObject = getObjectFromFile(pathToFile2);
  const diffsTree = makeDiffsTree(firstObject, secondObject);
  const buildOutput = chooseBuilder(format);
  const diffsString = buildOutput(diffsTree);
  return diffsString;
};

export default genDiff;
