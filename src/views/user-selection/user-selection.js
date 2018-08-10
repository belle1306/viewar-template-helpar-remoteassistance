import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, getContext, withProps, withState } from 'recompose'
import PropTypes from 'prop-types'

import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import authManager from '../../services/auth-manager'

import UserSelection from './user-selection.jsx'

export const goTo = ({history}) => async(route) => {
  history.push(route)
}

export const updateClientList = ({setClients, callClient}) => async() => {
  console.log('update client list', callClient.clients.list())
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
  getContext({
    callClient: PropTypes.object
  }),
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
      const { callClient, updateClientList, viewarApi: { appConfig }, authManager } = this.props

      if (callClient.connected) {
        if (!callClient.session) {
          await callClient.join({sessionId: appConfig.appId, user: authManager.user.username, userData: { supportAgent: true }})
          console.log('Current session', callClient.session)
        }

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
