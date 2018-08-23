import { compose, withHandlers, withState, lifecycle, withProps } from 'recompose'
import withCallClient from '../../services/call-client'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import highlightManager from '../../services/highlight-manager'
import { translate } from '../../services'
import withRouteProps from '../../views/route-props'

import Call from './Call.jsx'

export const waitForSupportAgent = ({ showDialog, connect, history, admin, viewarApi: { appConfig }, setWaitingForSupportAgent, callClient }) => async() => {
  if (!admin) {
    await connect({userData: { supportAgent: false }})

    if(callClient.connected && callClient.session) {
      setWaitingForSupportAgent(true)
      callSubscription = callClient.incomingCall.subscribe(async({ id }) => {
        const client = callClient.clients.list().find(client => client.id === id) || {}
        setWaitingForSupportAgent(false)
        const result = await showDialog(translate('MessageAcceptCall', false) + client.name || id + '?', {
          showCancel: true
        })

        if (result.confirmed) {
          await callClient.answerCall({ syncScene: true })
        } else {
          await callClient.rejectCall()
          setWaitingForSupportAgent(true)
        }
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

export const onTouch = ({ setLoading, admin, highlightManager, viewarApi: { simulateTouchRay } }) => async(event) => {
  setLoading(true)

  let x, y
  if (event.type === 'click') {
    x = event.clientX / event.target.offsetWidth
    y = event.clientY / event.target.offsetHeight
  }

  if (x !== undefined && y !== undefined) {
    await highlightManager.setTouchHighlight(x, y)
  }
  setLoading(false)

}

let callSubscription
export default compose(
  withCallClient,
  withState('waitingForSupportAgent', 'setWaitingForSupportAgent', false),
  withDialogControls,
  withSetLoading,
  withRouteProps(),
  withProps({
    viewarApi,
    getUiConfigPath,
    highlightManager,
  }),
  withHandlers({
    waitForSupportAgent,
    highlight,
    onTouch,
  }),
  lifecycle({
    async componentDidMount() {
      const { highlightManager, admin, waitForSupportAgent, viewarApi: { cameras, coreInterface } } = this.props
      highlightManager.isAdmin = admin
      await cameras.arCamera.activate()
      !admin && await coreInterface.call('setPointCloudVisibility', true, true)
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
)(Call)
