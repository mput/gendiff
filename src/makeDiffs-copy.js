import _ from 'lodash';

const getChildren = (fun, firstVal, secondVal) => {
  const first = _.isObject(firstVal)
  const second = _.isObject(secondVal)
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

const makeDiffsTree = (objectBefore, objectAfter) => {
  const mutualKeys = _.union(Object.keys(objectBefore), Object.keys(objectAfter));
  const diffs = mutualKeys.map((key) => {
    const diffNodeTemplate = { key, changeType: '', valueBefore: '', valueAfter: '', child: [] };
    const valueBefore = objectBefore[key];
    const valueAfter = objectAfter[key];

    if (_.isObject(valueBefore) && _.isObject(valueAfter)) {
      const child = getChildOrNull(makeDiffsTree, valueBefore, valueAfter);
      return { ...diffNodeTemplate, changeType: 'changedChild', child };
    } else if (valueBefore === valueAfter) {
      return { ...diffNodeTemplate, changeType: 'unchanged', valueBefore };
    } else if (valueBefore && valueAfter) {
      return { ...diffNodeTemplate, changeType: 'changed', valueBefore, valueAfter };
    } else if (valueBefore) {
      const child = getChildOrNull(makeDiffsTree, valueBefore, valueBefore);
      return { ...diffNodeTemplate, changeType: 'deleted', valueBefore, child };
    }
    const child = getChildOrNull(makeDiffsTree, valueAfter, valueAfter);
    return { ...diffNodeTemplate, changeType: 'added', valueAfter, child };
  });
  return diffs;
};

export default makeDiffsTree;
