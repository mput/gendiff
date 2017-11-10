import _ from 'lodash';

const makeTreeLine = (thisBuilder, diffObject, indentation = 0) => {
  const stringTemplate = (changSign, key, value) => `  ${changSign} ${key}: ${value}`;
  const stringRepresentation =
    {
      changedChild: diff => stringTemplate(' ', diff.key, thisBuilder(diff.child, indentation + 4)),
      unchanged: diff => stringTemplate(' ', diff.key, diff.valueBefore),
      changed: diff => [stringTemplate('+', diff.key, diff.valueAfter), stringTemplate('-', diff.key, diff.valueBefore)],
      deleted: (diff) => {
        const value = diff.child.length > 0 ? thisBuilder(diff.child, indentation + 4)
          : diff.valueBefore;
        return stringTemplate('-', diff.key, value);
      },
      added: (diff) => {
        const value = diff.child.length > 0 ? thisBuilder(diff.child, indentation + 4)
          : diff.valueAfter;
        return stringTemplate('+', diff.key, value);
      },
    };
  return stringRepresentation[diffObject.changeType](diffObject);
};

const makeTreeBlock = (arr, indentation = 0) => {
  const spaceCount = ' '.repeat(indentation);
  const divider = `\n${spaceCount}`;
  return `{${divider}${arr.join(divider)}${divider}}`;
};

const makePlainLine = (thisBuildBlock, diffObject, keyPrefix = '') => {
  const stringTemplate = (changSign, key, firstValue = '', secondValue = '') => {
    const valuesSection = secondValue ? ` '${firstValue}' to '${secondValue}'` : `${firstValue}`;
    return `Property '${keyPrefix}${key}' was ${changSign}${valuesSection}`;
  };
  const stringRepresentation =
    {
      changedChild: (diff) => {
        const keyPath = keyPrefix ? `${keyPrefix}${diff.key}` : `${diff.key}.`;
        return thisBuildBlock(diff.child, keyPath);
      },
      unchanged: () => '',
      changed: diff => stringTemplate('updated.From', diff.key, diff.valueBefore, diff.valueAfter),
      deleted: diff => stringTemplate('removed', diff.key),
      added: (diff) => {
        const value = diff.child.length > 0 ? ' complex value'
          : ` value: ${diff.valueAfter}`;
        return stringTemplate('added with', diff.key, value);
      },
    };
  return stringRepresentation[diffObject.changeType](diffObject);
};

const makePlainBlock = arr => `${arr.filter(line => line).join('\n')}`;

const builder = (buildLine, buildBlock) => {
  const makeChild = (diffsTree, ...args) => {
    const thisBuildOutput = builder(buildLine, buildBlock);
    return buildBlock(_.flatten(diffsTree.map(diff =>
      buildLine(thisBuildOutput, diff, ...args))), ...args);
  };
  return makeChild;
};

const chooseBuilder = (type) => {
  if (type === 'plain') {
    return builder(makePlainLine, makePlainBlock);
  }
  return builder(makeTreeLine, makeTreeBlock);
};

export default chooseBuilder;
