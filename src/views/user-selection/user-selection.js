import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'

import viewarApi from 'viewar-api'
import withCallClient from '../../services/call-client'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import authManager from '../../services/auth-manager'

import UserSelection from './user-selection.jsx'

export const goTo = ({history}) => async(route) => {
  history.push(route)
}

export const updateClientList = ({setClients, callClient}) => async() => {
  const clients = callClient.clients.list().filter(client => !client.supportAgent && client.available)
  setClients(clients)
}

export const call = ({ history, setLoading, callClient }) => async(client) => {
  setLoading(true)
  await callClient.call({ id: client.id })
  setLoading(false)

  history.push('/main-admin')
}

let clientSubscription
export default compose(
  withCallClient,
  withRouter,
  withDialogControls,
  withSetLoading,
  withState('clients', 'setClients', []),
  withProps({
    viewarApi,
    getUiConfigPath,
    authManager,
  }),
  withHandlers({
    updateClientList,
    call,
    goTo,
  }),
  lifecycle({
    async componentDidMount() {
      const { connect, callClient, updateClientList, viewarApi: { appConfig }, authManager } = this.props

      await connect({sessionId: appConfig.appId, user: authManager.user.username, userData: { supportAgent: true }})
      if (callClient.connected) {
        clientSubscription = callClient.clients.subscribe(updateClientList)
        updateClientList()
      }
    },
    componentWillUnmount() {
      if (clientSubscription) {
        clientSubscription.unsubscribe()
      }
    },
  })
)(UserSelection)
