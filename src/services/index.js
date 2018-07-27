import createTranslationProvider from './translations'

export const translationProvider = createTranslationProvider()

export const translate = (id, asHtml) => translationProvider ? translationProvider.translate(id, asHtml) : id
