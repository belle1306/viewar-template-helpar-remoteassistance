import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import withRouteParams from '../../services/route-params'
import annotationDb from '../../services/annotation-db'
import annotationManager from '../../services/annotation-manager'

import Review from './review.jsx'

export const init = ({setLoading, annotationDb, setAnnotations}) => async () => {
  const annotations = annotationManager.saved
  setAnnotations(annotations)
}

export const removeAnnotation = ({ annotations, setAnnotations }) => (annotation) => {
  const index = annotations.findIndex(entry => entry.id === annotation.id)
  if (index !== -1) {
    annotations.splice(index, 1)
    setAnnotations(annotations)
  }
}

export const createTag = ({tags, setTags, tag, setTag}) => () => {
  if (tags.indexOf(tag) === -1) {
    tags.push(tag)
    setTags(tags)
  }
  setTag('')
}

export const removeTag = ({setTags, tags}) => (tag) => {
  const index = tags.indexOf(tag)
  tags.splice(index, 1)
  setTags(tags)
}

export const updateAnnotation = ({ annotations, annotation, setAnnotation, setAnnotations }) => (details) => {
  Object.assign(annotation, details)
  setAnnotation(undefined)
}

export const saveReview = ({ goToLastView, saveAnnotation, setLoading, showDialog, annotations }) => async() => {
  const unhandledAnnotations = annotations.some(annotation => !annotation.title)
  let save = true

  if (unhandledAnnotations) {
    const { confirmed } = await showDialog('ReviewContinueSaving', {
      confirmText: 'Save',
      showCancel: true
    })

    save = confirmed
  }

  if (save) {
    setLoading(true)

    for (let annotation of annotations.filter(annotation => !!annotation.title)) {
      await saveAnnotation(annotation)
    }

    setLoading(false)
    goToLastView()
  }
}

export const saveAnnotation = ({ featureMap, annotationDb, tags }) => async(annotation) => {
  Object.assign(annotation, {
    productTags: tags,
    featureMap: featureMap || '',
  })

  await annotationDb.create(annotation)
}

export default compose(
  withDialogControls,
  withSetLoading,
  withRouteParams(),
  withState('annotations', 'setAnnotations', []),
  withState('tag', 'setTag', ''),
  withState('tags', 'setTags', []),
  withState('annotation', 'setAnnotation', null),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationDb,
    annotationManager,
  }),
  withHandlers({
    saveAnnotation,
  }),
  withHandlers({
    init,
    removeAnnotation,
    createTag,
    saveReview,
    removeTag,
    updateAnnotation,
  }),
  lifecycle({
    componentDidMount () {
      console.log(this.props.backPath, this.props.backArgs)
      this.props.init()
    }
  }),
)(Review)
