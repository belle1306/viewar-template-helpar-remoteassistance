import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps } from 'recompose'
import { withGoTo } from '../../services/param-props'

import HeaderBar from './header-bar.jsx'

export const defaultGoHome = ({history}) => () => history.push('/')

export const defaultGoBack = ({goToLast}) => () => goToLast()

// export const defaultGoBack = ({history}) => () => {
//   history.push({pathname: '/', state: {showMessage: 'MessageConnectionLost'}})
// }

export default compose(
  withRouter,
  withGoTo,
  withHandlers({
    defaultGoHome,
    defaultGoBack,
  }),
  withHandlers(props => ({
    goHomeFunction: ({goHome, defaultGoHome}) => () => typeof(goHome) === 'function' ? goHome() : defaultGoHome(),
    goBackFunction: ({goBack, defaultGoBack}) => () => typeof(goBack) === 'function' ? goBack() : defaultGoBack(),
  }))
)(HeaderBar)
