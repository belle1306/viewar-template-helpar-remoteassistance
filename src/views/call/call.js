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

export const waitForSupportAgent = ({ goToNextView, joinSession, showDialog, connect, history, admin, viewarApi: { appConfig }, setWaitingForSupportAgent, callClient }) => async() => {
  if (!admin) {
    await connect()
    await joinSession({userData: { available: true }})
  }

  if(callClient.connected && callClient.session) {
    syncSubscription = callClient.getData('annotation').subscribe(annotation => {
      console.log('receiving annotation', annotation)
      annotationManager.setAnnotation(annotation, admin)
    })

    endCallSubscription = callClient.endedCall.subscribe(async() => {
      await showDialog('MessageCallEnded', {
        confirmText: 'DialogOK'
      })

      goToNextView()
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

export const closeAnnotationPicker = ({ syncAnnotation, annotationManager, setShowAnnotationPicker }) => (confirmed) => {
  setShowAnnotationPicker(false)
  if (confirmed) {
    syncAnnotation()
    annotationManager.saveAnnotation()
  }
}

export const syncAnnotation = ({ annotationManager, callClient, admin }) => () => {
  const annotation = admin ? annotationManager.current : annotationManager.currentUser
  if (annotation) {
    console.log('sending annotation', annotation)
    callClient.sendData('annotation', annotation)
  }
}

export const goBack = ({ showDialog, goToNextView }) => async() => {
  const {confirmed} = await showDialog('CallAbortQuestion', {
    showCancel: true,
    confirmText: 'CallAbortCall'
  })

  if (confirmed) {
    goToNextView()
  }
}

export const saveTrackingMap = ({ setLoading, viewarApi: { trackers } }) => async() => {
  setLoading(true)

  let featureMap = ''
  const tracker = Object.values(trackers)[0]
  if (tracker && tracker.saveTrackingMap) {
    featureMap = await tracker.saveTrackingMap()
  }

  setLoading(false)

  return featureMap
}

export const goToNextView = ({ admin, goTo, backPath, backArgs, goToLastView, saveTrackingMap }) => async() => {
  if (admin) {
    const featureMap = await saveTrackingMap()
    goTo('/review', {
      backPath,
      backArgs,
      featureMap,
    })
  } else {
    goToLastView()
  }
}

let syncSubscription
let callSubscription
let endCallSubscription
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
    saveTrackingMap,
  }),
  withHandlers({
    syncAnnotation,
    goToNextView,
  }),
  withHandlers({
    waitForSupportAgent,
    onTouch,
    closeAnnotationPicker,
    goBack,
  }),
  lifecycle({
    async componentDidMount() {
      const { admin, waitForSupportAgent, annotationManager, viewarApi: { cameras, coreInterface } } = this.props
      await annotationManager.reset()

      await cameras.arCamera.activate()
      if (!admin) {
        await coreInterface.call('setPointCloudVisibility', true, true)
      }

      waitForSupportAgent()
    },
    async componentWillUnmount() {
      const { admin, callClient, viewarApi: { coreInterface, cameras } } = this.props
      if (callSubscription) {
        callSubscription.unsubscribe()
      }
      if (syncSubscription) {
        syncSubscription.unsubscribe()
      }
      if (endCallSubscription) {
        endCallSubscription.unsubscribe()
      }

      if (!admin) {
        await coreInterface.call('setPointCloudVisibility', true, true)
        await cameras.perspectiveCamera.activate()
      }

      callClient.endCall()
      if (!admin) {
        callClient.leave()
      }
    }
  })
)(Call)
