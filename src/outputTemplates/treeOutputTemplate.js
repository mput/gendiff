
const lineTemplate = (changeSign, key, value) => `  ${changeSign} ${key}: ${value}`;

const makeTreeLine = (blockBuilder, diff, indentation = 0) => {
  const { key, changeType, valueBefore, valueAfter, children } = diff;
  const childrenIndentation = indentation + 4;
  const childrenBlock = children.length > 0 ? blockBuilder(children, childrenIndentation) : false;

  const stringRepresentations =
    {
      changedChild: () => lineTemplate(' ', key, childrenBlock),
      unchanged: () => lineTemplate(' ', key, valueBefore),
      changed: () => [lineTemplate('+', key, valueAfter), lineTemplate('-', key, valueBefore)],
      deleted: () => lineTemplate('-', key, (childrenBlock || valueBefore)),
      added: () => lineTemplate('+', key, (childrenBlock || valueAfter)),
    };

  const makeLine = stringRepresentations[changeType];
  return makeLine();
};

const makeTreeBlock = (lines, indentation = 0) => {
  const gapCount = ' '.repeat(indentation);
  const divider = `\n${gapCount}`;
  return `{${divider}${lines.join(divider)}${divider}}`;
};

export { makeTreeLine, makeTreeBlock };
