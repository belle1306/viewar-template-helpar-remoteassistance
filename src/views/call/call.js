import { compose, withHandlers, withState, lifecycle, withProps } from 'recompose'
import withCallClient from '../../services/call-client'
import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import annotationManager from '../../services/annotation-manager'
import { translate } from '../../services'
import withRouteParams from '../../services/route-params'

import Call from './Call.jsx'

export const waitForSupportAgent = ({ showDialog, connect, history, admin, viewarApi: { appConfig }, setWaitingForSupportAgent, callClient }) => async() => {
  if (!admin) {
    await connect({userData: { supportAgent: false }})

    if(callClient.connected && callClient.session) {
      setWaitingForSupportAgent(true)
      callSubscription = callClient.incomingCall.subscribe(async({ id }) => {
        await callClient.answerCall()
        setWaitingForSupportAgent(false)
      })
    }
  }
}

export const annotation = ({ viewarApi: { cameras }, setLoading, annotationManager, admin }) => async() => {
  setLoading(true)
  const camera = Object.values(cameras).filter(camera => camera.active)[0]
  await annotationManager.setAnnotation(camera.pose.position, admin)
  setLoading(false)
}

export const onTouch = ({ setLoading, admin, annotationManager, viewarApi: { simulateTouchRay } }) => async(event) => {
  setLoading(true)

  let x, y
  if (event.type === 'click') {
    x = event.clientX / event.target.offsetWidth
    y = event.clientY / event.target.offsetHeight
  }

  if (x !== undefined && y !== undefined) {
    await annotationManager.setTouchAnnotation(x, y)
  }
  setLoading(false)

}

export const closeAnnotationPicker = ({ annotationManager, setShowAnnotationPicker }) => () => {
  // TODO: Sync annotation.
  //annotationManager.current
  setShowAnnotationPicker(false)
}

let callSubscription
export default compose(
  withCallClient,
  withDialogControls,
  withRouteParams(),
  withSetLoading,
  withState('waitingForSupportAgent', 'setWaitingForSupportAgent', false),
  withState('showAnnotationPicker', 'setShowAnnotationPicker', false),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationManager,
  }),
  withHandlers({
    waitForSupportAgent,
    annotation,
    onTouch,
    closeAnnotationPicker,
  }),
  lifecycle({
    async componentDidMount() {
      const { admin, waitForSupportAgent, viewarApi: { cameras, coreInterface } } = this.props
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
