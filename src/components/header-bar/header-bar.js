import { withRouter } from 'react-router';
import { compose, withHandlers } from 'recompose';
import { withRouteParams } from '../../services';

import template from './header-bar.jsx';

export const defaultGoHome = ({ goTo }) => () => goTo('/');

export const defaultGoBack = ({ goToLastView }) => () => goToLastView();

export default compose(
  withRouteParams(),
  withHandlers({
    defaultGoHome,
    defaultGoBack,
  }),
  withHandlers(props => ({
    goHomeFunction: ({ goHome, defaultGoHome }) => () =>
      typeof goHome === 'function' ? goHome() : defaultGoHome(),
    goBackFunction: ({ goBack, defaultGoBack }) => () =>
      typeof goBack === 'function' ? goBack() : defaultGoBack(),
  }))
)(template);
