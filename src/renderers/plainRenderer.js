import _ from 'lodash';

const lineTemplate = (changPhrase, key, valuesSection) =>
  `Property '${key}' was ${changPhrase}${valuesSection}`;

const plainRenderer = (diffsTree, prefix) => {
  const lines = diffsTree.map((diff) => {
    const { key, changeType, valueBefore, valueAfter, children } = diff;
    const keyWithPrefix = prefix ? `${prefix}.${key}` : key;
    const valueAdded = _.isObject(valueAfter) ? ' complex value' : ` value: ${valueAfter}`;
    const valuesChanged = ` '${valueBefore}' to '${valueAfter}'`;

    const lineRenderers =
      {
        changedChild: () => plainRenderer(children, keyWithPrefix),
        unchanged: () => '',
        changed: () => lineTemplate('updated.From', keyWithPrefix, valuesChanged),
        deleted: () => lineTemplate('removed', keyWithPrefix, ''),
        added: () => lineTemplate('added with', keyWithPrefix, valueAdded),
      };

    const makeLine = lineRenderers[changeType];
    return makeLine();
  });
  return lines.filter(line => line).join('\n');
};

export default plainRenderer;
