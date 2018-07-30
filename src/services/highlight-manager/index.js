import viewarApi from 'viewar-api'

import createHighlightManager from './highlight-manager'

export const getModel = async({ foreignKey, id }) => {
  const { modelManager } = viewarApi
  return modelManager.findModelByForeignKey(foreignKey) || await modelManager.getModelFromRepository(id)
}

export const insertModel = (model, ...args) => viewarApi.sceneManager.insertModel(model, ...args)

export default createHighlightManager({
  getModel,
  insertModel,
})
