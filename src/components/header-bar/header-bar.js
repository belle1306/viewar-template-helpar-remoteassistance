import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps } from 'recompose'
import withRouteProps from '../../views/route-props'

import HeaderBar from './header-bar.jsx'

export const defaultGoHome = ({goTo}) => () => goTo('/')

export const defaultGoBack = ({goToLastView}) => () => goToLastView()

export default compose(
  withRouteProps(),
  withHandlers({
    defaultGoHome,
    defaultGoBack,
  }),
  withHandlers(props => ({
    goHomeFunction: ({goHome, defaultGoHome}) => () => typeof(goHome) === 'function' ? goHome() : defaultGoHome(),
    goBackFunction: ({goBack, defaultGoBack}) => () => typeof(goBack) === 'function' ? goBack() : defaultGoBack(),
  }))
)(HeaderBar)
