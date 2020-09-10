import React from 'react';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import { IntlProvider } from 'react-intl';
import viewarApi from 'viewar-api';
import { createCallClient } from '@viewar/call';

import { ViewarContextProvider } from './utils/ViewarContext/ViewarContext';
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
import App from './app';

import '../css/global.scss';

(async function() {
  // TODO: move api initialization to ViewarContextProvider ?
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
    config,
    googleAnalytics,
    annotationManager,
    translationProvider,
    annotationDb,
    sceneDraw,
  });

  const rootElement =
    document.getElementById('app-root') || document.getElementById('app');

  const render = (Component) => {
    ReactDOM.render(
      <IntlProvider
        locale={translationProvider.language}
        key={translationProvider.language}
      >
        <ViewarContextProvider
          modules={{
            viewarApi,
            callClient,
          }}
        >
          <Component />
        </ViewarContextProvider>
      </IntlProvider>,
      rootElement
    );
  };

  render(App);
})();
