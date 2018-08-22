import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import annotationDb from '../../services/annotation-db'

import AnnotationSelection from './annotation-selection.jsx'

export const goTo = ({history}) => async (route) => {
  history.push(route)
}

export const init = ({setLoading, annotationDb, tags, setSearchResult}) => async () => {
  setLoading(true)
  await annotationDb.load(tags)
  console.log('TAGS', tags)
  setSearchResult(annotationDb.entries)
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

export const callSupport = ({history}) => () => {
  history.push('/calibration-call')
}

export const goToAnnotation = ({ history }) => () => {
  history.push('/annotation')
}

export default compose(
  withRouter,
  withDialogControls,
  withSetLoading,
  withState('search', 'setSearch', ''),
  withState('searchResult', 'setSearchResult', []),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationDb,
  }),
  withProps(({ match: { params }}) => ({
    tags: params.tags.split('&').map(decodeURIComponent),
  })),
  withHandlers({
    init,
    goTo,
    updateSearch,
    callSupport,
    goToAnnotation,
  }),
  lifecycle({
    componentDidMount () {
      this.props.init()
    }
  }),
)(AnnotationSelection)
