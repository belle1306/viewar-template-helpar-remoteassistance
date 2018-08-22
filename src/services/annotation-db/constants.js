export const DEFAULT_SEARCH_OPTIONS = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
}

export const PRODUCT_SEARCH_OPTIONS = {
  keys: [
    "productTags"
  ],
}

export const ANNOTATION_SEARCH_OPTIONS = {
  keys: [
    { name: "tags", weight: 0.3 },
    { name: "title", weight: 0.7 },
  ],
}
