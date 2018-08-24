import { withRouter } from 'react-router'
import { compose,  getContext, withHandlers } from 'recompose'
import PropTypes from 'prop-types'
import { withSetLoading } from './loading'
import { withDialogControls } from './dialog'
import withRouterProps from '../services/route-params'
import viewarApi from 'viewar-api'

const connect = ({ goToLastView, showDialog, setLoading, callClient }) => async(sessionArgs = {}) => {
  const { sessionId = viewarApi.appConfig.appId, user, password, userData } = sessionArgs

  setLoading(true, {message: 'MessageConnect'})
  await callClient.connect()
  setLoading(false)

  if (!callClient.connected) {
    await showDialog('MessageConnectionFailed', {
      confirmText: 'DialogOK'
    })
    goToLastView()
    return false
  }

  setLoading(true, { message: 'MessageJoin' })
  await callClient.join({ sessionId, user, password, userData })
  setLoading(false)

  if (!callClient.session) {
    setLoading(false)
    await showDialog('MessageJoinFailed', {
      confirmText: 'DialogOK'
    })
    goToLastView()
  }
}

const disconnect = ({ callClient }) => () => {
  if (callClient.session) {
    callClient.leave()
  }
}

export const withConnect = compose(
  withRouterProps(),
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
