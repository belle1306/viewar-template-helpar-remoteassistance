import viewarApi from 'viewar-api'

export default ({
  getModel,
  insertModel,
}) => {

  let initialized = false
  let models = {}
  let instances = {}

  const MODEL_DESCRIPTIONS = {
    highlight: {
      id: '45972',
      foreignKey: 'helpar_highlight',
      scale: 1
    }
  }

  const init = async(onProgress) => {
    if (!initialized) {
      const {modelManager} = viewarApi

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
        instances[id] = await insertModel(model, { visible: false })
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

  const setHighlight = async(position, admin = false) => {
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
      instances.highlight = (await insertModel(models.highlight, {
        pose,
        propertyValues,
        visible: true,
      }))
    } else {
      await instances.highlight.setPose(pose)
      await instances.highlight.setPropertyValues(propertyValues)
      await instances.highlight.setVisible(true)
    }
  }

  return {
    init,
    setHighlight,
  }

}
