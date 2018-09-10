import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, getContext } from 'recompose';
import { withDialogControls } from '../services/dialog';
import withRouteParams from '../services/route-params';

const render = ({ children }) => <Fragment>{children}</Fragment>;

export default compose(
  getContext({
    callClient: PropTypes.object,
  }),
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
