import {
  compose,
  withHandlers,
  lifecycle,
  withProps,
  withState,
} from 'recompose';
import withRouteParams from '../../services/route-params';
import viewarApi from 'viewar-api';
import withCallClient from '../../services/call-client';
import { getUiConfigPath } from '../../utils';
import { withDialogControls } from '../../services/dialog';
import { withSetLoading } from '../../services/loading';
import authManager from '../../services/auth-manager';

import UserSelection from './user-selection.jsx';

export const updateClientList = ({ setClients, callClient }) => async () => {
  const clients = callClient.clients.filter(
    client => client.data.available && client.role === 'Client'
  );

  setClients(clients);
};

export const call = ({
  showDialog,
  setWaitingForUser,
  goTo,
  setLoading,
  password,
  username,
  callClient,
}) => async clientId => {
  callSubscription = callClient.acceptedCall.subscribe((args = {}) => {
    const { data = {} } = args;
    const { featureMap } = data;
    setWaitingForUser(false);
    goTo('/call-admin', {
      featureMap,
      backPath: '/user-selection',
      backArgs: {
        username,
        password,
        backPath: '/',
      },
    });
  });

  lineBusyCallSubscription = callClient.lineBusy.subscribe(() => {
    setWaitingForUser(false);
    showDialog('UserSelectionLineBusy', {
      confirmText: 'DialogOK',
    });
  });

  setWaitingForUser(true);
  await callClient.call({ id: clientId });
};

export const formatTime = timestamp => {
  const date = new Date(timestamp);
  return isNaN(timestamp) ? timestamp : date.toLocaleString();
};

export const trimTopic = (text = '') => {
  const maxLength = 110;
  if (text.length > maxLength) {
    let sliced = text.slice(0, maxLength - 3);
    let lastSpace = sliced.lastIndexOf(' ');
    if (lastSpace !== sliced.length - 1) {
      sliced = sliced.slice(0, lastSpace);
    }
    return sliced + ' (...)';
  }

  return text;
};

let clientSubscription;
let callSubscription;
let refusedCallSubscription;
let lineBusyCallSubscription;
export default compose(
  withCallClient,
  withDialogControls,
  withSetLoading,
  withRouteParams(),
  withState('clients', 'setClients', []),
  withState('userName', 'setUserName', ''),
  withState('waitingForUser', 'setWaitingForUser', false),
  withProps({
    viewarApi,
    getUiConfigPath,
    authManager,
    trimTopic,
    formatTime,
  }),
  withHandlers({
    updateClientList,
    call,
  }),
  lifecycle({
    async componentDidMount() {
      const {
        connect,
        joinSession,
        callClient,
        updateClientList,
        viewarApi: { appConfig },
        authManager,
        username,
        password,
        setUserName,
      } = this.props;

      await connect();
      await joinSession({
        sessionId: appConfig.appId,
        username,
        password,
        userData: { available: false },
      });

      if (callClient.connected && callClient.session) {
        await authManager.login(username, password);
        setUserName(authManager.user.name);
        clientSubscription = callClient.clientsUpdate.subscribe(
          updateClientList
        );
        updateClientList();
      }
    },
    componentWillUnmount() {
      if (clientSubscription) {
        clientSubscription.unsubscribe();
      }
      if (callSubscription) {
        callSubscription.unsubscribe();
      }
      if (refusedCallSubscription) {
        refusedCallSubscription.unsubscribe();
      }
      if (lineBusyCallSubscription) {
        lineBusyCallSubscription.unsubscribe();
      }
    },
  })
)(UserSelection);
