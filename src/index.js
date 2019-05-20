import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import { compose, withContext } from 'recompose';
import viewarApi from 'viewar-api';

import {
  appState,
  authManager,
  sceneDraw,
  annotationDb,
  googleAnalytics,
  annotationManager,
  translationProvider,
} from './services';

import config from './config';
import { createCallClient } from 'viewar-call';

import App from './app';

import '../css/global.scss';

(async function() {
  window.api = await viewarApi.init({
    logToScreen: false,
    waitForDebugger: false,
  });
  merge(config, viewarApi.appConfig.uiConfig);

  await googleAnalytics.init();
  translationProvider.init();

  const callClient = await createCallClient(viewarApi, {
    host: config.serverUrl || 'wss://helpar.viewar.com:3003',
  });

  document.body.classList.add('global-CustomFont1');

  Object.assign(window, {
    appState,
    authManager,
    callClient,
    config,
    googleAnalytics,
    annotationManager,
    translationProvider,
    annotationDb,
    sceneDraw,
  });

  const rootElement =
    document.getElementById('app-root') || document.getElementById('app');

  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <IntlProvider
          locale={translationProvider.language}
          key={translationProvider.language}
        >
          <Component />
        </IntlProvider>
      </AppContainer>,
      rootElement
    );
  };

  const AppWithContext = compose(
    withContext({ callClient: PropTypes.object }, () => ({ callClient }))
  )(App);

  render(AppWithContext);

  if (module.hot) {
    module.hot.accept('./app', () => {
      const App = require('./app').default;

      const AppWithContext = compose(
        withContext({ callClient: PropTypes.object }, () => ({ callClient }))
      )(App);

      render(AppWithContext);
    });
  }
})();
