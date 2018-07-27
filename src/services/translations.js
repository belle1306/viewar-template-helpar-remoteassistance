import React from 'react'

import viewarApi from 'viewar-api'

import { addLocaleData } from 'react-intl'
import deLocaleData from 'react-intl/locale-data/de'
import enLocaleData from 'react-intl/locale-data/en'
import en from '../../assets/translations/en.js'
import de from '../../assets/translations/de.js'

const MOBILEPHONE_SUFFIX = '_Phone'
const WEBVERSION_SUFFIX = '_Web'

let translationList = {
  en,
  de,
}

export default createTranslationProvider

function createTranslationProvider () {
  let language = Object.keys(translationList)[0]
  let translations = {}
  let isMobilePhoneDevice = false
  let isWebVersion = false

  let translationProvider = {
    translate: (id) => id,
    init,
    setLanguage,
    get language () { return language },
    get translations () { return translations},
  }

  return translationProvider

  function init () {
    addLocaleData(deLocaleData)
    addLocaleData(enLocaleData)

    if (viewarApi.coreInterface.platform === 'Emscripten') {
      isWebVersion = true
    }

    if (viewarApi.appConfig.deviceType === 'phone') {
      isMobilePhoneDevice = true
    }

    // Filter out languages from uiConfig.languages (if given)
    const languageFilter = (viewarApi.appConfig.uiConfig || {}).languages
    if (languageFilter) {
      for(let key of Object.keys(translationList)) {
        if (languageFilter.indexOf(key) === -1) {
          delete translationList[key]
        }
      }

      setLanguage(Object.keys(translationList)[0])
    }

    setLanguage(viewarApi.appConfig.deviceLanguage)
    Object.assign(translationProvider, {
      translate: translateFn
    })
  }

  function setLanguage (lang) {
    if (translationList[lang]) {
      language = lang
      translations = translationList[lang]
    }
  }

  function translateFn (id, asHtml = true) {
    let translation = getTranslation(id)

    if (isMobilePhoneDevice) {
      translation = getTranslation(id, MOBILEPHONE_SUFFIX, translation)
    }

    if (isWebVersion) {
      translation = getTranslation(id, WEBVERSION_SUFFIX, translation)
    }

    if (strNotNull(translation)) {
      return asHtml ? <span dangerouslySetInnerHTML={{__html: translation}}/> : translation
    } else {
      // TODO: Log missing translation to server.
      return asHtml ? <span dangerouslySetInnerHTML={{__html: id}}/> : id
    }

  }

  function getTranslation (id, suffix = '', defaultValue = null) {
    if (strNotNull(translations[id + suffix])) {
      return translations[id + suffix]
    } else {
      return defaultValue
    }
  }

  function strNotNull (string) {
    return string || string === ''
  }

}
