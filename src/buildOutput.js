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


/*
Property 'timeout' was updated.From '50' to '20'
Property 'proxy' was removed
Property 'common.setting4' was removed
Property 'common.setting5' was removed
Property 'common.setting2' was added with value: 200
Property 'common.setting6' was added with complex value
Property 'common.sites.base' was added with 'hexlet.io'
Property 'group1.baz' was updated.From 'bars' to 'bas'
Property 'group3' was removed
Property 'verbose' was added with value: true
Property 'group2' was added with complex value
*/


const makePlainLine = (thisBuildBlock, diffObject, keyPrefix = '') => {
  const stringTemplate = (changSign, key, valueBefore, valueAfter) =>
    `Property ${keyPrefix}${key} was ${changSign}: ${valueBefore} ${valueAfter}`;
  const stringRepresentation =
    {
      changedChild: (diff) => {
        const keyPath = keyPrefix ? `${keyPrefix}${diff.key}` : `${diff.key}.`;
        return thisBuildBlock(diff.child, keyPath);
      },
      unchanged: diff => stringTemplate(' ', diff.key, diff.valueBefore, diff.valueAfter),
      changed: diff => [stringTemplate('+', diff.key, diff.valueAfter), stringTemplate('-', diff.key, diff.valueBefore)],
      deleted: (diff) => {
        const value = diff.child.length > 0 ? thisBuildBlock(diff.child)
          : diff.valueBefore;
        return stringTemplate('-', diff.key, value);
      },
      added: (diff) => {
        const value = diff.child.length > 0 ? thisBuildBlock(diff.child)
          : diff.valueAfter;
        return stringTemplate('+', diff.key, value);
      },
    };
  return stringRepresentation[diffObject.changeType](diffObject);
};

const makePlainBlock = arr => `${arr.join('\n')}`;

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
