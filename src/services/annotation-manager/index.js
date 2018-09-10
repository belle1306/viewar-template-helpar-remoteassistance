import viewarApi from 'viewar-api';

import createAnnotationManager from './annotation-manager';

export const insertModel = (model, ...args) =>
  viewarApi.sceneManager.insertModel(model, ...args);

export const getCategory = () =>
  viewarApi.modelManager.rootCategory.children.find(
    child => child.name.toLowerCase() === 'annotations'
  );

export const getTouchResult = (x, y, radius) =>
  viewarApi.sceneManager.simulateTouchRay(x, y, radius);

export const takeFreezeFrame = () =>
  viewarApi.cameras.arCamera.saveFreezeFrame();

export default createAnnotationManager({
  getCategory,
  insertModel,
  getTouchResult,
  takeFreezeFrame,
});
