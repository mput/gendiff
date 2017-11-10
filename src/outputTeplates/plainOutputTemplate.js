
const lineTemplate = (changSign, key, valuesSection) =>
  `Property '${key}' was ${changSign}${valuesSection}`;

const makePlainLine = (blockBuilder, diff, keyPrefix = '') => {
  const { key, changeType, valueBefore, valueAfter, child } = diff;
  const keyWithPrefix = keyPrefix ? `${keyPrefix}.${key}` : key;
  const valueAdded = child.length > 0 ? ' complex value' : ` value: ${valueAfter}`;
  const valuesChanged = ` '${valueBefore}' to '${valueAfter}'`;

  const stringRepresentations =
    {
      changedChild: () => blockBuilder(child, keyWithPrefix),
      unchanged: () => '',
      changed: () => lineTemplate('updated.From', keyWithPrefix, valuesChanged),
      deleted: () => lineTemplate('removed', keyWithPrefix, ''),
      added: () => lineTemplate('added with', keyWithPrefix, valueAdded),
    };

  const makeLine = stringRepresentations[changeType];
  return makeLine();
};

const makePlainBlock = lines => `${lines.filter(line => line).join('\n')}`;

export { makePlainLine, makePlainBlock };
