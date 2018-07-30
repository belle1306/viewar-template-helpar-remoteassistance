import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { compose, withHandlers, withState, lifecycle, withProps, getContext } from 'recompose'

import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import highlightManager from '../../services/highlight-manager'

import Main from './main.jsx'

export const goTo = ({history}) => async (route) => {
  history.push(route)
}

export const waitForSupportAgent = ({ admin , setWaitingForSupportAgent, callClient }) => async() => {
  if (!admin) {
    setWaitingForSupportAgent(true)
    callClient.incomingCall.subscribe(async({id}) => {
      await callClient.answerCall()
      setWaitingForSupportAgent(false)
    })
  }
}

export const highlight = ({ viewarApi: { cameras }, setLoading, highlightManager, admin }) => async() => {
  setLoading(true)
  const camera = Object.values(cameras).filter(camera => camera.active)[0]
  await highlightManager.setHighlight(camera.pose.position, admin)
  setLoading(false)
}

export default compose(
  getContext({
    callClient: PropTypes.object
  }),
  withState('waitingForSupportAgent', 'setWaitingForSupportAgent', false),
  withRouter,
  withDialogControls,
  withSetLoading,
  withProps({
    viewarApi,
    getUiConfigPath,
    highlightManager,
  }),
  withHandlers({
    goTo,
    waitForSupportAgent,
    highlight,
  }),
  lifecycle({
    componentDidMount() {
      const { waitForSupportAgent } = this.props
      waitForSupportAgent()
    }
  })
)(Main)
