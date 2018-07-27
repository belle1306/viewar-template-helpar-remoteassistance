import { MemoryRouter, Route, withRouter } from 'react-router'
import React, { Fragment } from 'react'
import { AnimatedSwitch } from 'react-router-transition'
import { compose, lifecycle, withState } from 'recompose'

import Home from './views/home/home.js'

import Spinner from './components/spinner/spinner.jsx'
import Toast from './components/toast/toast'
import Dialog from './components/dialog/dialog'

import { withLoading, withToast } from './services/loading'
import { withDialog } from './services/dialog'

import googleAnalytics from './services/google-analytics/index'

const EnhancedSpinner = withLoading()(Spinner)
const EnhancedToast = withToast()(Toast)
const EnhancedDialog = withDialog()(Dialog)

const GaMonitor = compose(
  withRouter,
  lifecycle({
    componentDidMount () {
      this.props.history.listen((location) => {
        googleAnalytics.logScreenView(location.pathname)
      })
    }
  })
)(({children,}) => <div>{children}</div>)

export default ({}) => <Fragment>
  <EnhancedToast key='toast'/>
  <EnhancedSpinner key='spinner'/>
  <EnhancedDialog key='dialog'/>
  <MemoryRouter key='router'>
    <GaMonitor>
      <AnimatedSwitch
        atEnter={{opacity: 0}}
        atLeave={{opacity: 0}}
        atActive={{opacity: 1}}
        className="SwitchWrapper"
      >
        <Route exact path='/' component={Home}/>
      </AnimatedSwitch>
    </GaMonitor>
  </MemoryRouter>
</Fragment>
