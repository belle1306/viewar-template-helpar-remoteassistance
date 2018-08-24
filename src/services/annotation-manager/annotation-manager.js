import viewarApi from 'viewar-api'

export default ({
  getCategory,
  getTouchResult,
  insertModel,
}) => {

  let initialized = false
  let models = {}
  let userModel = null    // Use model with foreign key 'helpar_user_highlight' as user model, if not existing take first.
  let instances = {}
  let userInstance = {}
  let current = false

  const init = async(onProgress) => {
    if (initialized) {
      await reset()
    } else {
      const { modelManager } = viewarApi

      const category = getCategory()
      if (category) {
        for (let model of category.children) {
          models[model.id] = model
          if (model.foreignKey === 'helpar_user_highlight') {
            userModel = model
          }
        }

        if (!userModel) {
          userModel = Object.values(models)[0]
        }

        const count = {
          total: Object.keys(models).length * 2,
          current: 0,
          currentProgress: 0,
        }

        const updateProgress = (id, progress) => {
          if (!isNaN(progress * 1)) {
            count.currentProgress = progress
            onProgress(count)
          }
        }

        modelManager.on('transferProgress', updateProgress)
        onProgress(count)

        for(let model of Object.values(models)) {
          // Download model.
          await model.download()
          count.current += 1
          count.currentProgress = 0
          onProgress(count)

          // Insert model.
          const instance = await insertModel(model, { id: model.id, visible: false })
          instances[model.id] = instance
          if (model === userModel) {
            userInstance = await insertModel(model, { id: model.id, visible: false })
          }
          onProgress(count)
        }

        modelManager.off('transferProgress', updateProgress)

      } else {
        console.error(`No categories with name 'annotations' found.`)
      }

      initialized = true
    }
  }

  const reset = async() => {
    for (let instance of Object.values(instances)) {
      await instance.setVisible(false)
    }
    await userInstance.setVisible(false)
  }

  const setAnnotation = async(spec = {}, user) => {
    const { model, pose } = spec

    if (user) {
      await userInstance.setPose(pose)
      await userInstance.setVisible(true)
    } else {
      current = false

      for (let [id, instance] of Object.entries(instances)) {
        if (id === model) {
          await instance.setPose(pose)
          await instance.setVisible(true)

          current = {
            pose,
            model,
          }
        } else {
          await instance.setVisible(false)
        }
      }
    }
  }

  const setTouchAnnotation = async({ model, x, y }, user = false) => {
    const hits = await getTouchResult(x, y, 40)
    if (hits.featurePoints.length) {
      await setAnnotation({ model, pose: { position: hits.featurePoints[0].intersection } }, user)
    } else {
      // TODO: Debug, remove
      await setAnnotation({ model, pose: { position: { x: Math.random(), y: Math.random(), z: Math.random() } } }, user)
    }
  }

  return {
    init,
    reset,
    setAnnotation,
    setTouchAnnotation,

    get current() { return current },
    get currentUser() { return userInstance.visible ? {
      model: userInstance.model.id,
      pose: userInstance.pose
    } : null },

    get models() { return Object.values(models) },
  }

}
