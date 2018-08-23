import { compose, withHandlers, withState, lifecycle, withProps } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import highlightManager from '../../services/highlight-manager'
import withRouteProps from '../../views/route-props'
import { translate } from '../../services'

import Annotation from './annotation.jsx'

export default compose(
  withDialogControls,
  withSetLoading,
  withProps({
    viewarApi,
    getUiConfigPath,
    highlightManager,
  }),
  withRouteProps(),
  lifecycle({
    async componentDidMount() {
    },
    componentWillUnmount() {
    }
  })
)(Annotation)
