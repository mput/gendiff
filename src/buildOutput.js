import { flatten } from 'lodash';
import { makeTreeLine, makeTreeBlock } from './outputTemplates/treeOutputTemplate';
import { makePlainLine, makePlainBlock } from './outputTemplates/plainOutputTemplate';


const builder = (buildLine, buildBlock) =>
  (diffsTree, ...args) => {
    const thisBuilder = builder(buildLine, buildBlock);
    const lines = flatten(diffsTree.map(diff => buildLine(thisBuilder, diff, ...args)));
    return buildBlock(lines, ...args);
  };


const chooseBuilder = (type) => {
  if (type === 'plain') {
    return builder(makePlainLine, makePlainBlock);
  }
  return builder(makeTreeLine, makeTreeBlock);
};

export default chooseBuilder;
