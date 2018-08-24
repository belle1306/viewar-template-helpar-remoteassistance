import Fuse from 'fuse-js-latest'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import every from 'lodash/difference'

import { DEFAULT_SEARCH_OPTIONS, PRODUCT_SEARCH_OPTIONS, ANNOTATION_SEARCH_OPTIONS } from './constants'

import fakeData from './fake-data'

const createAnnotationDb = () => {

  let db = []
  let entries = []
  let searchProvider

  const load = (prefilterProductTags) => {
    if (!db.length) {
      db = fakeData
    }

    entries = db
    if (prefilterProductTags) {
      entries = entries.filter(entry => prefilterProductTags.every(tag => entry.productTags.includes(tag)))
    }

    searchProvider = new Fuse(entries, DEFAULT_SEARCH_OPTIONS)
  }

  const searchForAnnotations = (searchString) => {
    Object.assign(searchProvider.options, ANNOTATION_SEARCH_OPTIONS)

    return searchProvider.search(searchString)
  }

  const searchForProductTags = (searchString) => {
    Object.assign(searchProvider.options, PRODUCT_SEARCH_OPTIONS)

    const searchResult = searchProvider.search(searchString)
    const uniqueProductTags = uniqWith(searchResult.map(item => item.productTags), isEqual)

    return uniqueProductTags
  }

  const get = (id) => {
    return entries.find(entry => entry.id === id)
  }

  return {
    load,
    searchForProductTags,
    searchForAnnotations,
    get,

    get entries() { return entries },
  }

}

export default createAnnotationDb()
