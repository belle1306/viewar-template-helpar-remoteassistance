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
  }

  if(callClient.connected && callClient.session) {
    syncSubscription = callClient.getData('annotation').subscribe(annotation => {
      console.log('receiving annotation', annotation)
      annotationManager.setAnnotation(annotation, admin)
    })

    if (!admin) {
      setWaitingForSupportAgent(true)
      callSubscription = callClient.incomingCall.subscribe(async() => {
        await callClient.answerCall()
        setWaitingForSupportAgent(false)
      })
    }
  }
}

export const onTouch = ({ syncAnnotation, setLoading, admin, annotationManager, viewarApi: { simulateTouchRay } }) => async(event) => {
  setLoading(true)

  let x, y
  if (event.type === 'click') {
    x = event.clientX / event.target.offsetWidth
    y = event.clientY / event.target.offsetHeight
  }

  if (x !== undefined && y !== undefined) {
    await annotationManager.setTouchAnnotation({x, y}, true)
    syncAnnotation()
  }
  setLoading(false)

}

export const closeAnnotationPicker = ({ syncAnnotation, annotationManager, setShowAnnotationPicker }) => () => {
  setShowAnnotationPicker(false)
  syncAnnotation()
}

export const syncAnnotation = ({ annotationManager, callClient, admin }) => () => {
  const annotation = admin ? annotationManager.current : annotationManager.currentUser
  if (annotation) {
    console.log('sending annotation', annotation)
    callClient.sendData('annotation', annotation)
  }
}

let syncSubscription
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
    syncAnnotation,
  }),
  withHandlers({
    waitForSupportAgent,
    onTouch,
    closeAnnotationPicker,
  }),
  lifecycle({
    async componentDidMount() {
      const { admin, waitForSupportAgent, annotationManager, viewarApi: { cameras, coreInterface } } = this.props
      await annotationManager.reset()

      await cameras.arCamera.activate()
      !admin && await coreInterface.call('setPointCloudVisibility', true, true)

      waitForSupportAgent()
    },
    componentWillUnmount() {
      const { callClient } = this.props
      if (callSubscription) {
        callSubscription.unsubscribe()
      }
      if (syncSubscription) {
        syncSubscription.unsubscribe()
      }

      callClient.endCall()
    }
  })
)(Call)
