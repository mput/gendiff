const jsonRenderer = diffsTree =>
  diffsTree.reduce((acc, diff) => {
    const { key, changeType, valueBefore, valueAfter, children } = diff;
    const childrenObj = children.length > 0 ? jsonRenderer(children) : {};
    return { ...acc, [key]: { changeType, valueBefore, valueAfter, children: childrenObj } };
  }, {});

export default jsonRenderer;
