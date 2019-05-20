import { compose, withHandlers, lifecycle, withProps } from 'recompose';
import { withRouteParams, withDialogControls } from '../../services';

import template from './admin-header-bar.jsx';

export const logOut = ({ showDialog, goTo }) => async () => {
  const { confirmed } = await showDialog('AdminLogout', {
    confirmText: 'DialogYes',
    cancelText: 'DialogNo',
    showCancel: true,
  });

  if (confirmed) {
    goTo('/');
  }
};

export default compose(
  withDialogControls,
  withRouteParams(),
  withHandlers({
    logOut,
  })
)(template);
