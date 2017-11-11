import _ from 'lodash';

const getDivider = (indentation) => {
  const gapCount = ' '.repeat(indentation);
  return `\n${gapCount}`;
};

const valueRender = (value, indentation) => {
  const divider = getDivider(indentation);
  const doubleDivider = getDivider(indentation + 4);
  if (value instanceof Array) {
    return value;
  } else if (value instanceof Object) {
    const lines = Object.keys(value).map(key => `${key}: ${value[key]}`);
    return `{${doubleDivider}${lines.join(doubleDivider)}${divider}}`;
  }
  return value;
};

const lineTemplate = (changeSign, key, value) => `  ${changeSign} ${key}: ${value}`;

const treeRenderer = (diffsTree, indentation = 0) => {
  const lines = diffsTree.map((diff) => {
    const { key, changeType, valueBefore, valueAfter, children } = diff;
    const childrenIndentation = indentation + 4;
    const renderedValBefore = valueRender(valueBefore, childrenIndentation);
    const renderedValAfter = valueRender(valueAfter, childrenIndentation);
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
