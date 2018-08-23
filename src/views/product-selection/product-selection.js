import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import { withGoTo, withParamProps } from '../../services/param-props'
import annotationDb from '../../services/annotation-db'

import ProductSelection from './product-selection.jsx'

export const init = ({setLoading, annotationDb, input, updateSearch}) => async () => {
  setLoading(true)
  await annotationDb.load()
  updateSearch(input || '')
  setLoading(false)
}

export const updateSearch = ({annotationDb, setSearch, setSearchResult}) => (value) => {
  setSearch(value)
  const searchResult = annotationDb.searchForProductTags(value)
  setSearchResult(searchResult)
}

export const goToAnnotationSelection = ({ goToWithArgs, createPathWithArgs, search }) => (tags) => {
  const tagsParam = tags.map(encodeURI).join('&')

  goToWithArgs('/annotation-selection', {
    tags: tagsParam,
    input: 'reifen',
    backPath: '/product-selection/',
    backArgs: { input: search }
  })
}

export default compose(
  withRouter,
  withDialogControls,
  withSetLoading,
  withGoTo,
  withParamProps(),
  withState('search', 'setSearch', ''),
  withState('searchResult', 'setSearchResult', []),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationDb,
  }),
  withHandlers({
    updateSearch,
  }),
  withHandlers({
    init,
    goToAnnotationSelection,
  }),
  lifecycle({
    componentDidMount () {
      this.props.init()
    }
  }),
)(ProductSelection)
