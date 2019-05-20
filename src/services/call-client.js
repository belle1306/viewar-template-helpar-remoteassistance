import { compose, getContext, withHandlers } from 'recompose';
import PropTypes from 'prop-types';
import viewarApi from 'viewar-api';

import { withDialogControls, withSetLoading } from './';

const connect = ({
  goToLastView,
  showDialog,
  setLoading,
  callClient,
}) => async () => {
  setLoading(true, { message: 'MessageConnect' });
  await callClient.connect();
  setLoading(false);

  if (!callClient.connected) {
    await showDialog('MessageConnectionFailed', {
      confirmText: 'DialogOK',
    });
    goToLastView();
    return false;
  }
};

const joinSession = ({
  goToLastView,
  setLoading,
  callClient,
  showDialog,
}) => async (sessionArgs = {}) => {
  const {
    sessionId = viewarApi.appConfig.appId,
    username,
    password,
    userData,
  } = sessionArgs;

  setLoading(true, { message: 'MessageJoin' });
  await callClient.join({ sessionId, username, password, userData });
  setLoading(false);

  if (!callClient.session) {
    setLoading(false);
    await showDialog('MessageJoinFailed', {
      confirmText: 'DialogOK',
    });
    goToLastView();
    return false;
  }
  return true;
};

const disconnect = ({ callClient }) => () => {
  if (callClient.session) {
    callClient.leave();
  }
};

export const withCallClient = compose(
  withDialogControls,
  withSetLoading,
  getContext({
    callClient: PropTypes.object,
  }),
  withHandlers({
    connect,
    disconnect,
    joinSession,
  })
);
