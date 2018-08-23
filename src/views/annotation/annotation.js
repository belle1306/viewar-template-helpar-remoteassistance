import { withRouter } from 'react-router'
import { compose, withHandlers, withState, lifecycle, withProps } from 'recompose'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import highlightManager from '../../services/highlight-manager'
import { withGoTo, withParamProps } from '../../services/param-props'
import { translate } from '../../services'

import Annotation from './annotation.jsx'

export default compose(
  withRouter,
  withDialogControls,
  withSetLoading,
  withProps({
    viewarApi,
    getUiConfigPath,
    highlightManager,
  }),
  withGoTo,
  withParamProps(),
  lifecycle({
    async componentDidMount() {
      console.log('backPath', this.props.backPath)
      console.log('backArgs', this.props.backArgs)
    },
    componentWillUnmount() {
    }
  })
)(Annotation)
