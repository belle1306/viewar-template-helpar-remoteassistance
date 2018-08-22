import { withRouter } from 'react-router'
import { compose, withHandlers } from 'recompose'

import NothingFoundCallSupport from './nothing-found-call-support.jsx'

const callSupport = ({ history }) => () => {
  history.push('/calibration-call')
}

export default compose(
  withRouter,
  withHandlers({
    callSupport,
  })
)(NothingFoundCallSupport)
