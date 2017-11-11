import _ from 'lodash';

const changeTypes = [
  {
    type: 'changedChild',
    check: (val1, val2) => ((_.isObject(val1) && _.isObject(val2)) &&
      (!(val1 instanceof Array) && !(val2 instanceof Array))),
  },
  { type: 'unchanged',
    check: (val1, val2) => ((val1 === val2) || (_.isEqual(val1, val2))),
  },
  { type: 'changed', check: (val1, val2) => (val1 && val2) },
  { type: 'deleted', check: val1 => (val1) },
  { type: 'added', check: (val1, val2) => (val2) },
];

const makeDiffsTree = (objectBefore, objectAfter) => {
  const mutualKeys = _.union(Object.keys(objectBefore), Object.keys(objectAfter));
  const diffs = mutualKeys.map((key) => {
    const valueBefore = objectBefore[key] || null;
    const valueAfter = objectAfter[key] || null;
    const changeType = _.find(changeTypes, ({ check }) => check(valueBefore, valueAfter)).type;
    const children = (changeType === 'changedChild') ?
      makeDiffsTree(valueBefore, valueAfter) : [];
    return { key, changeType, valueBefore, valueAfter, children };
  });
  return diffs;
};

export default makeDiffsTree;
