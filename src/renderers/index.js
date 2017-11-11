import treeRenderer from './treeRenderer';
import plainRenderer from './plainRenderer';
import jsonRenderer from './jsonRenderer';

export default (type) => {
  if (type === 'plain') {
    return plainRenderer;
  } else if (type === 'json') {
    return jsonRenderer;
  }
  return treeRenderer;
};
