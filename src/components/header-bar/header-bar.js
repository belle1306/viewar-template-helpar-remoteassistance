import { withRouter } from 'react-router'
import { compose, withHandlers, lifecycle, withProps } from 'recompose'

import HeaderBar from './header-bar.jsx'

export const defaultGoHome = ({history}) => () => history.push('/')

// export const defaultGoBack = ({history}) => () => history.goBack()
export const defaultGoBack = ({history}) => () => {
  history.push({pathname: '/', state: {showMessage: 'MessageConnectionLost'}})
  // history.goBack()
}

export default compose(
  withRouter,
  withHandlers({
    defaultGoHome,
    defaultGoBack,
  }),
  withHandlers(props => ({
    goHomeFunction: ({goHome, defaultGoHome}) => () => typeof(goHome) === 'function' ? goHome() : defaultGoHome(),
    goBackFunction: ({goBack, defaultGoBack}) => () => typeof(goBack) === 'function' ? goBack() : defaultGoBack(),
  }))
)(HeaderBar)
