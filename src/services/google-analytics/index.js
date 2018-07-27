import viewarApi from 'viewar-api'

import loadGoogleAnalytics from './viewar-google-analytics'

export default createGoogleAnalytics(viewarApi)

export function createGoogleAnalytics (viewarApi) {
  const googleAnalytics = {
    init,
    log: () => {},
    logScreenView,
    logEvent,
    logSocial,
    logTiming,
    logException,
  }

  return googleAnalytics

  async function init () {
    const {appConfig} = viewarApi

    if (appConfig.uiConfig && appConfig.uiConfig.googleAnalyticsKey) {
      await loadGoogleAnalytics(window)
      const ga = window.ga

      if (typeof ga !== 'undefined') {
        ga('create', appConfig.uiConfig.googleAnalyticsKey, 'auto')
        ga('set', 'appName', appConfig.appId)
        ga('set', 'appVersion', appConfig.version.app)

        Object.assign(googleAnalytics, {
          log
        })
      } else {
        console.error('Google Analytics: Failed to initialize script, ga is undefined.')
      }
    } else {
      console.error('Google Analytics: Missing entry \'googleAnalyticsKey\' in ui config.')
    }
  }

  function log (type, data) {
    Object.assign({
      hitType: type,
    }, data)

    ga('send', type, data)
  }

  function logScreenView (screenName) {
    googleAnalytics.log('screenview', {screenName})
  }

  function logEvent (eventCategory, eventAction, eventLabel, eventValue) {
    googleAnalytics.log('event', {eventCategory, eventAction, eventLabel, eventValue})
  }

  function logSocial (socialNetwork, socialAction, socialTarget) {
    googleAnalytics.log('social', {socialNetwork, socialAction, socialTarget})
  }

  function logTiming (timingCategory, timingVar, timingValue) {
    googleAnalytics.log('timing', {timingCategory, timingVar, timingValue})
  }

  function logException (exDescription, exFatal) {
    googleAnalytics.log('exception', {exDescription, exFatal})
  }
}
