import treeRenderer from './treeRenderer';
import plainRenderer from './plainRenderer';
import jsonRenderer from './jsonRenderer';

const rendererTypes = {
  tree: treeRenderer,
  plain: plainRenderer,
  json: jsonRenderer,
};

export default type => rendererTypes[type];
