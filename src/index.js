import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import { compose, withContext } from 'recompose';
import viewarApi from 'viewar-api';
import appState from './services/app-state';
import authManager from './services/auth-manager';
import annotationDb from './services/annotation-db';
import googleAnalytics from './services/google-analytics/index';
import annotationManager from './services/annotation-manager';
import config from './config';
import { translationProvider } from './services/index';
import 'normalize.css/normalize.css';
import { createCallClient } from 'viewar-call';
import { auth, db } from './services/firebase';

import App from './app';

import '../css/global.css';

(async function() {
  window.api = await viewarApi.init({
    logToScreen: false,
    waitForDebugger: false,
  });
  merge(config, viewarApi.appConfig.uiConfig);

  await googleAnalytics.init();
  translationProvider.init();

  const callClient = await createCallClient(viewarApi, {
    host: config.serverUrl || 'ws://3.viewar.com:3002',
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
    auth,
    db,
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
    module.hot.accept(App, () => render(AppWithContext));
  }
})();
