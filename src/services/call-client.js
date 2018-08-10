import { withRouter } from 'react-router'
import { compose,  getContext, withHandlers } from 'recompose'
import PropTypes from 'prop-types'
import { withSetLoading } from './loading'
import { withDialogControls } from './dialog'
import viewarApi from 'viewar-api'

const connect = ({ history, showDialog, setLoading, callClient }) => async(sessionArgs = {}) => {
  const { sessionId = viewarApi.appConfig.appId, user, password, userData } = sessionArgs

  setLoading(true, {message: 'MessageConnect'})
  await callClient.connect()
  setLoading(false)

  if (!callClient.connected) {
    await showDialog('MessageConnectionFailed', {
      confirmText: 'DialogOK'
    })
    history.goBack()
    return false
  } else {
    callClient.incomingCall.subscribe(async(call) => {
      console.log('Incoming call', call)
    })

    callClient.acceptedCall.subscribe(call => {
      console.log('Accepted Call', call)
    })

    callClient.refusedCall.subscribe(call => {
      console.log('Call refused', call)
    })

    callClient.endedCall.subscribe(call => {
      console.log('Ended call', call)
    })

    callClient.lineBusy.subscribe(call => {
      console.log('Line busy', call)
    })
  }

  setLoading(true, { message: 'MessageJoin' })
  await callClient.join({ sessionId, user, password, userData })
  setLoading(false)

  if (!callClient.session) {
    setLoading(false)
    await showDialog('MessageJoinFailed', {
      confirmText: 'DialogOK'
    })
    history.goBack()
  }
}

const disconnect = ({ callClient }) => () => {
  if (callClient.session) {
    callClient.leave()
  }
}

export const withConnect = compose(
  withRouter,
  withDialogControls,
  withSetLoading,
  getContext({
    callClient: PropTypes.object
  }),
  withHandlers({
    connect,
    disconnect,
  }),
)

export default withConnect
