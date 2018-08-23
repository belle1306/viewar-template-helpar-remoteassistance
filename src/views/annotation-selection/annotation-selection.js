import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import annotationDb from '../../services/annotation-db'
import withRouteProps from '../../views/route-props'

import AnnotationSelection from './annotation-selection.jsx'

export const init = ({setLoading, annotationDb, tags, input, updateSearch}) => async () => {
  setLoading(true)
  await annotationDb.load(tags)
  updateSearch(input || '')
  setLoading(false)
}

export const updateSearch = ({annotationDb, setSearch, setSearchResult}) => (value) => {
  setSearch(value)

  if (value.length === 0) {
    setSearchResult(annotationDb.entries)
  } else {
    const searchResult = annotationDb.searchForAnnotations(value)
    setSearchResult(searchResult)
  }

}

export const callSupport = ({goTo}) => () => {
  goTo('/calibration-call')
}

export const openAnnotation = ({ goTo, backPath, backArgs, history, search, tags, args }) => (annotationId) => {
  goTo('/calibration-annotation', {
    annotationId,
    backPath: '/annotation-selection',
    backArgs: {
      input: search,
      tags: args.tags,
      backPath,
      backArgs: backArgs,
    }
  })
}

export default compose(
  withDialogControls,
  withSetLoading,
  withState('search', 'setSearch', ''),
  withState('searchResult', 'setSearchResult', []),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationDb,
  }),
  withRouteProps({
    tags: tags => tags.split('&').map(decodeURIComponent),
  }),
  withHandlers({
    updateSearch,
  }),
  withHandlers({
    init,
    callSupport,
    openAnnotation,
  }),
  lifecycle({
    componentDidMount () {
      this.props.init()
    }
  }),
)(AnnotationSelection)
