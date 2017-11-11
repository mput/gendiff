import _ from 'lodash';

const getChildren = (fun, firstVal, secondVal) => {
  const first = _.isObject(firstVal);
  const second = _.isObject(secondVal);
  switch (true) {
    case (first && second):
      return fun(firstVal, secondVal);
    case (first):
      return fun(firstVal, firstVal);
    case (second):
      return fun(secondVal, secondVal);
    default:
      return [];
  }
};

const changeTypes = [
  { check: (val1, val2) => (_.isObject(val1) && _.isObject(val2)), type: 'changedChild' },
  { check: (val1, val2) => (val1 === val2), type: 'unchanged' },
  { check: (val1, val2) => (val1 && val2), type: 'changed' },
  { check: val1 => (val1), type: 'deleted' },
  { check: (val1, val2) => (val2), type: 'added' },
];

const makeDiffsTree = (objectBefore, objectAfter) => {
  const mutualKeys = _.union(Object.keys(objectBefore), Object.keys(objectAfter));
  const diffs = mutualKeys.map((key) => {
    const valueBefore = objectBefore[key] || '';
    const valueAfter = objectAfter[key] || '';
    const children = getChildren(makeDiffsTree, valueBefore, valueAfter);
    const changeType = _.find(changeTypes, ({ check }) => check(valueBefore, valueAfter)).type;
    return { key, changeType, valueBefore, valueAfter, children };
  });
  return diffs;
}

export default makeDiffsTree;
