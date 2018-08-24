import viewarApi from 'viewar-api'

export default ({
  getCategory,
  getTouchResult,
  insertModel,
}) => {

  let initialized = false
  let models = {}
  let instances = {}
  let currentModel = false
  let currentPose = false

  const init = async(onProgress) => {
    if (initialized) {
      await reset()
    } else {
      const { modelManager } = viewarApi

      const category = getCategory()
      if (category) {
        for (let model of category.children) {
          models[model.id] = model
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
          // Download model
          await model.download()
          count.current += 1
          count.currentProgress = 0
          onProgress(count)

          // Instantiate model
          const instance = await insertModel(model, { id: model.id, visible: false })
          instances[model.id] = instance
          // await sceneManager.removeNode(instance)
          count.current += 1
          count.currentProgress = 0
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
  }

  const setAnnotation = async({model, pose}) => {
    currentPose = null
    currentModel = null

    for (let [id, instance] of Object.entries(instances)) {
      if (id === model) {
        await instance.setPose(pose)
        await instance.setVisible(true)
        currentPose = pose
        currentModel = model
      } else {
        await instance.setVisible(false)
      }
    }
  }

  const setTouchAnnotation = async(model, x, y) => {
    const hits = getTouchResult(x, y, 40)
    if (hits.featurePoints.length) {
      await setAnnotation({ model, pose: { position: hits.featurePoints[0].intersection } })
    }
  }

  return {
    init,
    reset,
    setAnnotation,
    setTouchAnnotation,

    get current() { return {
      pose: currentPose,
      model: currentModel,
    } },

    get models() { return Object.values(models) },
  }

}
