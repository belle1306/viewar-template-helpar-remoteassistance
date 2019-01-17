import viewarApi from 'viewar-api';

import createAnnotationManager from './annotation-manager';

export const insertModel = (model, ...args) =>
  viewarApi.sceneManager.insertModel(model, ...args);

export const getCategory = async () => {
  let category = viewarApi.modelManager.rootCategory.children.find(
    child => child.foreignKey === 'helpar_annotations'
  );

  if (!category) {
    category = await viewarApi.modelManager.fetchCategoryFromRepository('4589');
  }

  return category;
};

export const getTouchResult = (x, y, radius) =>
  viewarApi.sceneManager.simulateTouchRay(x, y, radius);

export const takeFreezeFrame = () =>
  viewarApi.cameras.arCamera.saveFreezeFrame();

export const takeScreenshot = async () => {
  const { screenshotManager, coreInterface } = viewarApi;
  await screenshotManager.takeScreenshot();
  const screenshot = await screenshotManager.saveScreenshot('annotations');
  return coreInterface.resolveUrl(screenshot);
};

export default createAnnotationManager({
  getCategory,
  insertModel,
  getTouchResult,
  takeFreezeFrame,
  takeScreenshot,
});
