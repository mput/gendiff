
const lineTemplate = (changeSign, key, value) => `  ${changeSign} ${key}: ${value}`;

const makeTreeLine = (blockBuilder, diff, indentation = 0) => {
  const { key, changeType, valueBefore, valueAfter, child } = diff;
  const childerIdentation = indentation + 4;
  const childerBlock = child.length > 0 ? blockBuilder(child, childerIdentation) : false;

  const stringRepresentations =
    {
      changedChild: () => lineTemplate(' ', key, childerBlock),
      unchanged: () => lineTemplate(' ', key, valueBefore),
      changed: () => [lineTemplate('+', key, valueAfter), lineTemplate('-', key, valueBefore)],
      deleted: () => lineTemplate('-', key, (childerBlock || valueBefore)),
      added: () => lineTemplate('+', key, (childerBlock || valueAfter)),
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
