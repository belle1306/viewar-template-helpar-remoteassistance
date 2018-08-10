import { withRouter } from 'react-router'
import { compose, withHandlers, withState, lifecycle, withProps } from 'recompose'
import withCallClient from '../../services/call-client'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import highlightManager from '../../services/highlight-manager'

import Main from './main.jsx'

export const goTo = ({history}) => async (route) => {
  history.push(route)
}

export const waitForSupportAgent = ({ connect, history, admin, viewarApi: { appConfig }, setWaitingForSupportAgent, callClient }) => async() => {
  if (!admin) {
    await connect({userData: { supportAgent: false }})

    if(callClient.connected && callClient.session) {
      setWaitingForSupportAgent(true)
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
export default compose(
  withCallClient,
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
      if (callSubscription) {
        callSubscription.unsubscribe()
      }

      callClient.endCall()
    }
  })
)(Main)
