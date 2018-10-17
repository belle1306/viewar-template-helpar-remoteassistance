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
import withRouteParams from '../../services/route-params';
import annotationDb from '../../services/annotation-db';

import ProductSelection from './product-selection.jsx';

export const init = ({
  setLoading,
  annotationDb,
  input,
  updateSearch,
}) => async () => {
  setLoading(true);
  await annotationDb.prepareData('annotations');
  updateSearch(input || '');
  setLoading(false);
};

export const updateSearch = ({
  annotationDb,
  setSearch,
  setSearchResult,
  setLoading,
}) => async(value) => {
  setSearch(value);

  if(!value) {
    setLoading(true);
    await annotationDb.prepareData('annotations');
    setSearchResult([]);
    setLoading(false);
  } else {
    const searchResult = annotationDb.searchForAnnotations(value);
    setSearchResult(searchResult);
  }
};

export const callSupport = ({ goTo, search }) => () => {
  goTo('/calibration-call', {
    backPath: '/product-selection/',
    backArgs: { input: search },
    topic: search,
  });
};

export const openAnnotation = ({
  goTo,
  backPath,
  backArgs,
  search,
}) => annotationId => {
  goTo('/calibration-annotation', {
    annotationId,
    backPath: '/product-selection',
    backArgs: {
      input: search,
      backPath,
      backArgs: backArgs,
    },
  });
};

export const trimDescription = (text) => {
  const maxLength = 110;
  if (text.length > maxLength) {
    let sliced = text.slice(0, maxLength - 3);
    let lastSpace = sliced.lastIndexOf(' ');
    if (lastSpace !== sliced.length - 1) {
      sliced = sliced.slice(0, lastSpace);
    }
    return sliced + ' (...)';
  }

  return text;
}

export default compose(
  withDialogControls,
  withSetLoading,
  withRouteParams(),
  withState('search', 'setSearch', ''),
  withState('searchResult', 'setSearchResult', []),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationDb,
    trimDescription,
  }),
  withHandlers({
    updateSearch,
  }),
  withHandlers({
    init,
    openAnnotation,
    callSupport,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
  })
)(ProductSelection);
