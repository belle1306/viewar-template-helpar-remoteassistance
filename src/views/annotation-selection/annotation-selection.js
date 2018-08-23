import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import annotationDb from '../../services/annotation-db'
import { withGoTo, withParamProps } from '../../services/param-props'

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

export const callSupport = ({history}) => () => {
  history.push('/calibration-call')
}

export const openAnnotation = ({ goToWithArgs, backPath, backArgs, history, search, args }) => (annotationId) => {
  goToWithArgs('/calibration-annotation', {
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
  withGoTo,
  withParamProps({
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
      window.test = this.props.history
    }
  }),
)(AnnotationSelection)
