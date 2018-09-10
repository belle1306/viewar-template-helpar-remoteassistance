import { withRouter } from 'react-router';
import { compose, withHandlers, lifecycle, withProps } from 'recompose';
import withRouteParams from '../../services/route-params';

import HeaderBar from './header-bar.jsx';

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
)(HeaderBar);
