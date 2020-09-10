import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';

import { withDialogControls, withRouteParams } from '../services';

const render = ({ children }) => <Fragment>{children}</Fragment>;

const ConnectionMonitor = compose(
  withRouteParams(),
  withDialogControls,
  lifecycle({
    componentDidMount() {
      const { callClient, goTo, showDialog, goToLastView } = this.props;

      callClient.disconnect.subscribe(async () => {
        await showDialog('MessageConnectionLost', {
          confirmText: 'DialogOK',
        });
        goTo('/');
      });
    },
  })
)(render);

export default ConnectionMonitor;
