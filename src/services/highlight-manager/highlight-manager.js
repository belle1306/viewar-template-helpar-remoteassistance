import viewarApi from 'viewar-api'

export default ({
  getModel,
  insertModel,
}) => {

  let initialized = false
  let models = {}
  let instances = {}
  let isAdmin = false

  const MODEL_DESCRIPTIONS = {
    highlight: {
      id: '45972',
      foreignKey: 'helpar_highlight',
      scale: 1
    }
  }

  const init = async(onProgress) => {
    if (!initialized) {
      const {modelManager, sceneManager} = viewarApi

      for (let [id, description] of Object.entries(MODEL_DESCRIPTIONS)) {
        const model = await getModel(description)
        if (model) {
          models[id] = model
        }
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

      for(let [id, model] of Object.entries(models)) {
        // Download model
        await model.download()
        count.current += 1
        count.currentProgress = 0
        onProgress(count)

        // Instantiate model
        const instance = await insertModel(model, { visible: false })
        await sceneManager.removeNode(instance)
        count.current += 1
        count.currentProgress = 0
        onProgress(count)
      }

      modelManager.off('transferProgress', updateProgress)

      initialized = true
    } else {
      for (let instance of Object.values(instances)) {
        await instance.setVisible(false)
      }
    }
  }

  const setHighlight = async(position, admin = isAdmin) => {
    const pose = {
      position,
      scale: {
        x: MODEL_DESCRIPTIONS.highlight.scale,
        y: MODEL_DESCRIPTIONS.highlight.scale,
        z: MODEL_DESCRIPTIONS.highlight.scale,
      }
    }

    const propertyValues = {
      color: admin ? 'red' : 'blue'
    }

    if(!instances.highlight) {
      instances.highlight = []
    }

    instances.highlight.push(await insertModel(models.highlight, {
      pose,
      propertyValues,
      visible: true,
    }))
  }

  const setTouchHighlight = async(x, y) => {
    const { sceneManager } = viewarApi

    const hits = await sceneManager.simulateTouchRay(x, y, 40)
    if (hits.featurePoints.length) {
      await setHighlight(hits.featurePoints[0].intersection, isAdmin)
    }
  }

  return {
    init,
    setHighlight,
    setTouchHighlight,

    set isAdmin(newIsAdmin) { isAdmin = newIsAdmin },
  }

}
