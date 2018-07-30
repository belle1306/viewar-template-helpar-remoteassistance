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

export const updateClientList = ({setClientIds, callClient}) => async({id}) => {
  const clientIds = callClient.clients.list().map(client => client.name)
  setClientIds(clientIds)
}

export const call = ({ history, setLoading, callClient }) => async(clientId) => {
  setLoading(true)
  await callClient.call({ id: clientId })
  setLoading(false)

  history.push('/main-admin')
}

export default compose(
  getContext({
    callClient: PropTypes.object
  }),
  withRouter,
  withDialogControls,
  withSetLoading,
  withState('clientIds', 'setClientIds', []),
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
      this.props.callClient.clients.subscribe(this.props.updateClientList)
    }
  })
)(UserSelection)
