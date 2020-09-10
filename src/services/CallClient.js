class CallClient {
  // async constructor({config}) {
  //   await this.client = await createCallClient(viewarApi, {
  //     host: config.serverUrl || 'wss://helpar.viewar.com:3003',
  //   });
  // }

  /**
   * @property client
   * instance from `createCallClient()`
   */
  client = null;

  joinSession = ({ goToLastView, setLoading, callClient, showDialog }) => async (
    sessionArgs = {}
  ) => {
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

  disconnect = () => {
    if (this.session) {
      this.client.leave();
    }
  };
}
