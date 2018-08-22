import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import annotationDb from '../../services/annotation-db'

import ProductSelection from './product-selection.jsx'

export const goTo = ({history}) => async (route) => {
  history.push(route)
}

export const init = ({setLoading, annotationDb}) => async () => {
  setLoading(true)
  await annotationDb.load()
  setLoading(false)
}

export const updateSearch = ({annotationDb, setSearch, setSearchResult}) => (value) => {
  setSearch(value)
  const searchResult = annotationDb.searchForProductTags(value)
  setSearchResult(searchResult)
}

export const goToAnnotationSelection = ({ history }) => (tags) => {
  const param = tags.map(encodeURIComponent).join('&')
  history.push('/annotation-selection/' + param)
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
  withHandlers({
    init,
    goTo,
    updateSearch,
    goToAnnotationSelection,
  }),
  lifecycle({
    componentDidMount () {
      this.props.init()
    }
  }),
)(ProductSelection)
