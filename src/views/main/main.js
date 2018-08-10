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

export const waitForSupportAgent = ({ history, admin, viewarApi: { appConfig }, setWaitingForSupportAgent, callClient }) => async() => {
  callEndedSubscription = callClient.endedCall.subscribe(() => {
    history.goBack()
  })

  if (!admin) {
    setWaitingForSupportAgent(true)

    if(callClient.connected && callClient.session) {
      callSubscription = callClient.incomingCall.subscribe(async({id}) => {
        await callClient.answerCall()
        const sceneState = viewarApi.sceneManager.getSceneState();
        callClient.sendData("scene", sceneState);
        setWaitingForSupportAgent(false)
      })
    }
  }
}

export const highlight = ({ viewarApi: { cameras }, setLoading, highlightManager, admin }) => async() => {
  setLoading(true)
  const camera = Object.values(cameras).filter(camera => camera.active)[0]
  await highlightManager.setHighlight(camera.pose.position, admin)
  setLoading(false)
}

let callSubscription
let callEndedSubscription
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
      const { waitForSupportAgent, viewarApi: { cameras } } = this.props
      cameras.arCamera.activate()
      waitForSupportAgent()
    },
    componentWillUnmount() {
      const { callClient } = this.props
      if (callClient.connected && callClient.session) {
        callClient.endCall()
      }

      if (callSubscription) {
        callSubscription.unsubscribe()
      }
    }
  })
)(Main)
