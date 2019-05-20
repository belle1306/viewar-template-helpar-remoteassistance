import Fuse from 'fuse-js-latest';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { auth, db } from '../firebase';
import fakeData from './fake-data';

import {
  DEFAULT_SEARCH_OPTIONS,
  PRODUCT_SEARCH_OPTIONS,
  ANNOTATION_SEARCH_OPTIONS,
} from './constants';

/**
 * Annotations are saved as 4 individual data nodes:
 *   - annotations The basic information about every annotation (id, title, description).
 *   - details The 3d data of an annotation (featureMap, pose, model).
 *   - productTags The product tags of an annotation.
 *   - tags The annotation specific tags of an annotation.
 *
 * With prepareData(type) you can either load just the product tags (type = 'productTags') or the annotations (
 * type = 'annotations'). When type is 'annotations' you can give { productTags = [] } as argument to prefilter
 * annotations.
 *
 * Before searching (searchForAnnotations or searchForProductTags) you should prepare the data first with prepareData().
 * For the search each data of the individual data nodes is combined to one Object. This is supposed to reduce database
 * queries to avoid querying all the data.
 */
const createAnnotationDb = () => {
  let initialized = false;
  let searchProvider;
  let data = {
    annotations: {},
    details: {},
    productTags: {},
    tags: {},
  };
  let productTags = {};

  // ---------------------------------------------------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------------------------------------------------

  /**
   * Creates a search provider out of the existing data.
   *
   * @param searchOptions Optional parameter for fuse.
   */
  const createSearchProvider = (searchOptions = DEFAULT_SEARCH_OPTIONS) => {
    searchProvider = new Fuse(
      Object.values(createEntries()),
      Object.assign({}, DEFAULT_SEARCH_OPTIONS, searchOptions)
    );
  };

  /**
   * Helper function to compose annotation out of each individual part.
   */
  const createEntries = () => {
    const entries = {};

    for (let type of Object.keys(data)) {
      assignDataEntry(type, entries);
    }

    return entries;
  };

  /**
   * Helper function to compose annotation out of each individual part.
   */
  const assignDataEntry = (type, entries) => {
    Object.entries(data[type] || {}).forEach(([id, entry]) => {
      assignEntry(id, entry, type, entries);
    });
  };

  /**
   * Helper function to compose annotation out of each individual part.
   */
  const assignEntry = (id, value, type, entries) => {
    if (!entries[id]) {
      entries[id] = {};
    }

    if (Array.isArray(value)) {
      entries[id][type] = value;
    } else {
      Object.assign(entries[id], value);
    }
  };

  /**
   * Log in to the database. To avoid a database with no existing users create user first.
   */
  const initDb = async () => {
    if (!initialized) {
      try {
        await auth.createUser('helpar@viewar.com', '3ddesign');
      } catch (e) {
        console.log(e.message);
      }

      await auth.signIn('helpar@viewar.com', '3ddesign');

      initialized = true;
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------
  // Public
  // ---------------------------------------------------------------------------------------------------------------------

  /**
   * Prepares a specific type of data (either productTags or annotations). Annotations can be pre-filtered with
   * productTags when given as argument.
   *
   * @param type The type of data ('productTags' or 'annotations').
   * @param args Optional arguments as object.
   */
  const prepareData = async (type = 'none', args = {}) => {
    await initDb();

    switch (type) {
      case 'productTags':
        data.productTags = await db.read('productTags');

        // Adapt { id: array } values to [{ id, productTags: array }] for fuse search.
        const fuseData = [];
        for (let [id, productTags] of Object.entries(data.productTags)) {
          fuseData.push({
            id,
            productTags,
          });
        }

        searchProvider = new Fuse(
          fuseData,
          Object.assign({}, DEFAULT_SEARCH_OPTIONS, PRODUCT_SEARCH_OPTIONS)
        );
        break;

      case 'annotations':
        const { productTags } = args;
        data.productTags = await db.read('productTags');

        if (productTags) {
          const lowerCaseProductTags = productTags.map(tag =>
            tag.toLowerCase()
          );
          const ids = [];
          Object.entries(data.productTags).forEach(([id, tags]) => {
            if (
              tags.every(tag =>
                lowerCaseProductTags.includes(tag.toLowerCase())
              )
            ) {
              ids.push(id);
            } else {
              delete data.productTags[id];
            }
          });

          data.annotations = {};
          data.tags = {};
          for (let id of ids) {
            const tags = await db.read(`tags/${id}`);
            data.annotations[id] = await db.read(`annotations/${id}`);
            data.tags[id] = tags;
          }
        } else {
          data.annotations = await db.read('annotations');
          data.tags = await db.read('tags');
        }

        createSearchProvider(ANNOTATION_SEARCH_OPTIONS);
        break;
    }
  };

  /**
   * Search for Annotations. Uses fuzzy logic search (Fuse). Requires prepareData('annotations') first.
   *
   * @param searchString The string to search for.
   * @returns {*} Search results.
   */
  const searchForAnnotations = searchString => {
    if (!searchProvider) {
      console.error(
        `Search Provider not initialized. Run prepareData(dataType) first.`
      );
      return {};
    }

    return searchProvider.search(searchString);
  };

  /**
   * Search for Product Tags. Uses fuzzy logic search (Fuse). Requires prepareData('productTags') first.
   *
   * @param searchString The string to search for.
   * @returns [] Search results.
   */
  const searchForProductTags = searchString => {
    if (!searchProvider) {
      console.error(
        `Search Provider not initialized. Run prepareData(dataType) first.`
      );
      return [];
    }

    const searchResult = searchProvider.search(searchString);
    const uniqueProductTags = uniqWith(
      searchResult.map(item => item.productTags),
      isEqual
    );

    return uniqueProductTags;
  };

  /**
   * Reads all individual data nodes for a specific annotation id and composes the annotation.
   *
   * @param id The annotation id.
   * @returns {*} The composed annotation.
   */
  const get = async id => {
    await initDb();

    const annotations = {};
    for (let type of Object.keys(data)) {
      const value = await db.read(`${type}/${id}`);
      assignEntry(id, value, type, annotations);
    }

    return annotations[id];
  };

  /**
   * Creates a new annotation and saves it in the database.
   *
   * @param id The unique id.
   * @param title The display title.
   * @param description A short description.
   * @param tags Annotation specific tags.
   * @param productTags Product specific tags.
   * @param featureMap Feature Map id.
   * @param pose Position/Orientation/Scale of the annotation.
   * @param drawing Drawing description of the annotation.
   * @param model The annotation model's id.
   */
  const create = async ({
    id,
    title,
    description,
    tags,
    productTags,
    featureMap,
    pose = null,
    model = null,
    drawing = null,
  }) => {
    await initDb();

    const newData = {
      annotations: {
        id,
        title,
        description,
      },
      details: {
        featureMap,
        pose,
        model,
        drawing,
      },
      tags,
      productTags,
    };

    for (let [type, value] of Object.entries(newData)) {
      await db.write(`${type}/${id}`, value);
      data[type][id] = value;
    }
  };

  /**
   * Rebuilds the database.
   *
   * WARNING: This will override your previously saved db data.
   */
  const buildDbFromFakeData = async (data = fakeData) => {
    await initDb();

    const productTags = {};
    const tags = {};
    const annotations = {};
    const details = {};

    Object.values(data).forEach(entry => {
      const { id, title, description, featureMap, pose, model } = entry;

      productTags[id] = entry.productTags;
      tags[id] = entry.tags;
      annotations[id] = {
        id,
        title,
        description,
      };
      details[id] = {
        featureMap,
        pose,
        model,
      };
    });

    const dbData = {
      productTags,
      annotations,
      details,
      tags,
    };

    await db.write('/', dbData);

    return dbData;
  };

  // ---------------------------------------------------------------------------------------------------------------------
  // Interface
  // ---------------------------------------------------------------------------------------------------------------------

  return {
    prepareData,
    searchForProductTags,
    searchForAnnotations,
    get,
    create,

    buildDbFromFakeData,

    get entries() {
      return createEntries();
    },
  };
};

export default createAnnotationDb();
