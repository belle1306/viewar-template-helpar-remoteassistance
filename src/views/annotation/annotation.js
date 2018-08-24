import { compose, withHandlers, withState, lifecycle, withProps } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import highlightManager from '../../services/highlight-manager'
import annotationDb from '../../services/annotation-db'
import withRouteParams from '../../services/route-params'
import { translate } from '../../services'

import Annotation from './annotation.jsx'

export const init = ({ setLoading, annotation, updateSelection, viewarApi: { sceneManager, modelManager } }) => async() => {
  setLoading(true)
  await sceneManager.clearScene()
  const model = modelManager.findModelByForeignKey(annotation.model) || await modelManager.getModelFromRepository(annotation.model)
  if (model) {
    await sceneManager.insertModel(model, {
      id: annotation.id,
      pose: annotation.pose,
      interaction: {
        rotation: false,
        translation: false,
        scaling: false,
      }
    })
  } else {
    console.error(`Couldn't find annotation model '${annotation.model}'.`)
  }

  sceneManager.on('selectionChanged', updateSelection)
  setLoading(false)
}

export const destroy = ({ viewarApi: { sceneManager }, updateSelection, annotation }) => async() => {
  const instance = sceneManager.findNodeById(annotation.id)
  if (instance) {
    await sceneManager.removeNode(instance)
  }
  sceneManager.off('selectionChanged', updateSelection)
}

export const updateSelection = ({ setDescriptionVisible }) => (instance) => {
  setDescriptionVisible(!!instance)
}

export const showRateOverlay = ({ setRateOverlayVisible }) => () => setRateOverlayVisible(true)

export const closeRateOverlay = ({ setLoading, rating, backPath, backArgs, goTo, goToLastView, setRateOverlayVisible }) => (success) => {
  setLoading(true)
  if (rating !== undefined) {
    // TODO: Save rating
  }
  setLoading(false)

  if (success) {
    goToLastView()
  } else {
    goTo('/calibration-call', {
      backPath,
      backArgs,
    })
  }
}

export const rateAnnotation = ({ setRating }) => (rating) => {

  console.log('Annotation rated: ' + rating)
  setRating(rating)
}

export default compose(
  withDialogControls,
  withSetLoading,
  withState('rating', 'setRating', undefined),
  withState('descriptionVisible', 'setDescriptionVisible', false),
  withState('rateOverlayVisible', 'setRateOverlayVisible', false),
  withProps({
    viewarApi,
    getUiConfigPath,
    highlightManager,
    annotationDb,
  }),
  withRouteParams(),
  withProps(({ annotationDb, annotationId }) => ({
    annotation: annotationDb.get(annotationId)
  })),
  withHandlers({
    updateSelection,
  }),
  withHandlers({
    init,
    destroy,
    showRateOverlay,
    closeRateOverlay,
    rateAnnotation,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init()
    },
    async componentWillUnmount() {
      await this.props.destroy()
    }
  })
)(Annotation)
