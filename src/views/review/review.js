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
import annotationManager from '../../services/annotation-manager';
import authManager from '../../services/auth-manager';

import Review from './review.jsx';

export const init = ({
  setLoading,
  annotationDb,
  setAnnotations,
  setTags,
  setTag,
}) => async () => {
  const annotations = annotationManager.saved;

  setTag('');
  setTags([]);

  setAnnotations(annotations);
};

export const removeAnnotation = ({
  annotations,
  setAnnotations,
}) => annotation => {
  const index = annotations.findIndex(entry => entry.id === annotation.id);
  if (index !== -1) {
    annotations.splice(index, 1);
    setAnnotations(annotations);
  }
};

export const createTag = ({ tags, setTags, tag, setTag }) => () => {
  if (tags.indexOf(tag) === -1 && tag) {
    tags.push(tag);
    console.log('[createTag] setTags', tags);
    setTags(tags);
  }
  setTag('');
};

export const removeTag = ({ setTags, tags }) => tag => {
  const index = tags.indexOf(tag);
  tags.splice(index, 1);
  console.log('[removeTag] setTags', tags);
  setTags(tags);
};

export const updateAnnotation = ({
  annotations,
  annotation,
  setAnnotation,
  setAnnotations,
}) => details => {
  Object.assign(annotation, details);
  setAnnotation(undefined);
};

export const cancelReview = ({ goToLastView }) => () => {
  goToLastView();
};

export const saveReview = ({
  featureMap,
  goToLastView,
  saveAnnotations,
  setLoading,
  showDialog,
  annotations,
  createTag,
}) => async () => {
  const unhandledAnnotations = annotations.some(
    annotation => !annotation.title
  );

  let save = true;

  if (unhandledAnnotations) {
    const { confirmed } = await showDialog('ReviewContinueSaving', {
      confirmText: 'Save',
      showCancel: true,
    });

    save = confirmed;
  }

  if (save) {
    setLoading(true);
    createTag();

    const success = await saveAnnotations();

    setLoading(false);
    success && goToLastView();
  }
};

export const saveAnnotations = ({
  saveAnnotation,
  annotations,
  showDialog,
  tags,
}) => async () => {
  const changedAnnotations = annotations.some(annotation => annotation.title);

  if (changedAnnotations) {
    if (!tags.length) {
      await showDialog('ReviewSavingNoTags', {
        confirmText: 'OK',
      });

      return false;
    }

    for (let annotation of annotations.filter(
      annotation => !!annotation.title
    )) {
      await saveAnnotation(annotation);
    }
  }

  return true;
};

export const saveAnnotation = ({
  featureMap,
  annotationDb,
  annotations,
  tags,
  showDialog,
}) => async annotation => {
  if (tags.length) {
    Object.assign(annotation, {
      productTags: tags,
      featureMap: featureMap || '',
    });

    await annotationDb.create(annotation);
  }
};

export default compose(
  withDialogControls,
  withSetLoading,
  withRouteParams(),
  withState('annotations', 'setAnnotations', []),
  withState('tag', 'setTag', ''),
  withState('tags', 'setTags', []),
  withState('annotation', 'setAnnotation', null),
  withProps(() => ({
    viewarApi,
    getUiConfigPath,
    annotationDb,
    annotationManager,
    userName: authManager.user.name,
  })),
  withHandlers({
    saveAnnotation,
    createTag,
  }),
  withHandlers({
    saveAnnotations,
  }),
  withHandlers({
    init,
    removeAnnotation,
    saveReview,
    cancelReview,
    removeTag,
    updateAnnotation,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
  })
)(Review);
