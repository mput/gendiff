import _ from 'lodash';

const getChildOrNull = (fn, firstVal, secondVal) => {
  if (_.isObject(firstVal) && _.isObject(secondVal)) {
    return fn(firstVal, secondVal);
  }
  return [];
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
