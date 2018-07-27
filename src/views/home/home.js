import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps } from 'recompose'

import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'

import Home from './home.jsx'

export const goTo = ({history}) => async (route) => {
  history.push(route)
}

export const init = ({viewarApi, resetTrackers, showDialog}) => async () => {
  await viewarApi.sceneManager.clearScene()
  await resetTrackers()
  showDialog('Hello')
}

export const resetTrackers = ({viewarApi}) => async () => {
  for (let tracker of Object.values(viewarApi.trackers)) {
    await tracker.deactivate()
  }
}

export default compose(
  withRouter,
  withDialogControls,
  withProps({
    viewarApi,
    getUiConfigPath,
  }),
  withHandlers({
    resetTrackers,
  }),
  withHandlers({
    init,
    goTo,
  }),
  lifecycle({
    componentDidMount () {
      this.props.init()
    }
  }),
)(Home)
