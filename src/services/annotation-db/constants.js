export const DEFAULT_SEARCH_OPTIONS = {
  shouldSort: true,
  threshold: 0.0,   // 0.0 => exact match, disable fuzzy logic search.
  location: 0,
  distance: 0,      // 0 => exact match, disable fuzzy logic search.
  maxPatternLength: 32,
  minMatchCharLength: 1,
};

export const PRODUCT_SEARCH_OPTIONS = {
  keys: ['productTags'],
};

export const ANNOTATION_SEARCH_OPTIONS = {
  keys: [{ name: 'tags', weight: 0.2 }, { name: 'productTags', weight: 0.3 }, { name: 'title', weight: 0.4 }],
};
