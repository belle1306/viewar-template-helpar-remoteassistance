import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import merge from 'lodash/merge'
import { AppContainer } from 'react-hot-loader'
import { IntlProvider } from 'react-intl'
import { compose, withContext } from 'recompose'
// import { createCallClient } from './mock/viewar-call'
import viewarApi from 'viewar-api'
import appState from './services/app-state'
import authManager from './services/auth-manager'
import googleAnalytics from './services/google-analytics/index'
import highlightManager from './services/highlight-manager'
import config from './config'
import { translationProvider } from './services/index'
import 'normalize.css/normalize.css';
import { createCallClient } from 'viewar-call';

import App from './app'

import '../css/global.css'

(async function () {

  window.api = await viewarApi.init({logToScreen: false, waitForDebugger: false})
  merge(config, viewarApi.appConfig.uiConfig)

  await googleAnalytics.init()
  translationProvider.init()

  const callClient = await createCallClient(viewarApi, { host: 'ws://192.168.0.31:3001' })
  if (callClient.connected) {

    callClient.incomingCall.subscribe(async(call) => {
      console.log('Incoming call', call)
    })

    callClient.acceptedCall.subscribe(call => {
      console.log('Accepted Call', call)
    })

    callClient.refusedCall.subscribe(call => {
      console.log('Call refused', call)
    })

    callClient.endedCall.subscribe(call => {
      console.log('Ended call', call)
    })

    callClient.lineBusy.subscribe(call => {
      console.log('Line busy', call)
    })
  } else {
    console.log('Could not join session, no connection.')
  }


  document.body.classList.add('global-CustomFont1')

  Object.assign(window, {
    appState,
    authManager,
    callClient,
    config,
    googleAnalytics,
    highlightManager,
    translationProvider,
  })

  const rootElement = document.getElementById('app-root') || document.getElementById('app')

  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <IntlProvider locale={translationProvider.language} key={translationProvider.language}>
          <Component/>
        </IntlProvider>
      </AppContainer>,
      rootElement
    )
  }

  const AppWithContext = compose(
    withContext(
      { callClient: PropTypes.object },
      () => ({ callClient })
    )
  )(App)

  render(AppWithContext)

  if (module.hot) {
    module.hot.accept('./app', () => render(App))
  }

}())
