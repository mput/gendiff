import _ from 'lodash';

const getDivider = (indentation) => {
  const gapCount = ' '.repeat(indentation);
  return `\n${gapCount}`;
};

const valueRenderer = (val, indentation) => {
  if ((val instanceof Object) && !(val instanceof Array)) {
    const divider = getDivider(indentation);
    const doubleDivider = getDivider(indentation + 4);
    const lines = Object.keys(val).map(key => `${key}: ${val[key]}`);
    return `{${doubleDivider}${lines.join(doubleDivider)}${divider}}`;
  }
  return String(val);
};


const lineTemplate = (changeSign, key, value) => `  ${changeSign} ${key}: ${value}`;

const treeRenderer = (diffsTree, indentation = 0) => {
  const lines = diffsTree.map((diff) => {
    const { key, changeType, valueBefore, valueAfter, children } = diff;
    const childrenIndentation = indentation + 4;
    const renderedValBefore = valueRenderer(valueBefore, childrenIndentation);
    const renderedValAfter = valueRenderer(valueAfter, childrenIndentation);

    const lineRepresentations =
      {
        changedChild: () => lineTemplate(' ', key, treeRenderer(children, childrenIndentation)),
        unchanged: () => lineTemplate(' ', key, valueBefore),
        changed: () => [lineTemplate('+', key, renderedValAfter), lineTemplate('-', key, renderedValBefore)],
        deleted: () => lineTemplate('-', key, renderedValBefore),
        added: () => lineTemplate('+', key, renderedValAfter),
      };
    const makeLine = lineRepresentations[changeType];
    return makeLine();
  });
  const divider = getDivider(indentation);
  const flattenLines = _.flatten(lines);
  return `{${divider}${flattenLines.join(divider)}${divider}}`;
};

export default treeRenderer;
