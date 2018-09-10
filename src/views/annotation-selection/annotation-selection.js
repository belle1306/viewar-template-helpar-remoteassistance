import {
  compose,
  withHandlers,
  lifecycle,
  withProps,
  withState,
} from 'recompose';
import viewarApi from 'viewar-api';
import { getUiConfigPath } from '../../utils';
import { withDialogControls } from '../../services/dialog';
import { withSetLoading } from '../../services/loading';
import annotationDb from '../../services/annotation-db';
import withRouteParams from '../../services/route-params';

import AnnotationSelection from './annotation-selection.jsx';

export const init = ({
  setLoading,
  annotationDb,
  tags,
  input,
  updateSearch,
}) => async () => {
  setLoading(true);
  await annotationDb.prepareData('annotations', { productTags: tags });
  updateSearch(input || '');
  setLoading(false);
};

export const updateSearch = ({
  annotationDb,
  setSearch,
  setSearchResult,
}) => value => {
  setSearch(value);

  if (value.length === 0) {
    setSearchResult(Object.values(annotationDb.entries));
  } else {
    const searchResult = annotationDb.searchForAnnotations(value);
    setSearchResult(searchResult);
  }
};

export const callSupport = ({
  goTo,
  backPath,
  args,
  backArgs,
  search,
}) => () => {
  goTo('/calibration-call', {
    backPath: '/annotation-selection',
    backArgs: {
      input: search,
      tags: args.tags,
      backPath,
      backArgs: backArgs,
    },
  });
};

export const openAnnotation = ({
  goTo,
  backPath,
  backArgs,
  search,
  args,
}) => annotationId => {
  goTo('/calibration-annotation', {
    annotationId,
    backPath: '/annotation-selection',
    backArgs: {
      input: search,
      tags: args.tags,
      backPath,
      backArgs: backArgs,
    },
  });
};

export default compose(
  withDialogControls,
  withSetLoading,
  withState('search', 'setSearch', ''),
  withState('searchResult', 'setSearchResult', []),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationDb,
  }),
  withRouteParams({
    tags: tags => tags.split('&').map(decodeURIComponent),
  }),
  withHandlers({
    updateSearch,
  }),
  withHandlers({
    init,
    callSupport,
    openAnnotation,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
  })
)(AnnotationSelection);
