import {
  compose,
  withHandlers,
  withState,
  lifecycle,
  withProps,
} from 'recompose';
import viewarApi from 'viewar-api';
import { getUiConfigPath } from '../../utils';
import { withDialogControls } from '../../services/dialog';
import { withSetLoading } from '../../services/loading';
import annotationManager from '../../services/annotation-manager';
import annotationDb from '../../services/annotation-db';
import withRouteParams from '../../services/route-params';
import { translate } from '../../services';
import { withTrackingMap } from '../../services/tracking-map';

import Annotation from './annotation.jsx';
import sceneDraw from '../../services/scene-draw';

export const init = ({
  setTracking,
  setAnnotation,
  updateTracking,
  annotationId,
  annotationDb,
  annotationManager,
  setLoading,
  annotation,
  updateSelection,
  loadTrackingMap = () => {
    console.error('Annotation view has no loadTrackingMap function.');
  },
  viewarApi: { sceneManager, tracker, cameras },
}) => async () => {
  setLoading(true);
  const annotation = await annotationDb.get(annotationId);
  setLoading(false);

  if (annotation.model) {
    annotationManager.setAnnotation(annotation, false);
  } else if (annotation.drawing) {
    sceneDraw.insertDrawing(annotation.drawing);
  }

  if (annotation.featureMap) {
    if (tracker) {
      tracker.on('trackingTargetStatusChanged', updateTracking);
      await loadTrackingMap(annotation.featureMap);
    }

    updateTracking();
  } else {
    setTracking(true);
  }

  await cameras.arCamera.showPointCloud();
  sceneManager.on('selectionChanged', updateSelection);
  setAnnotation(annotation);
};

export const destroy = ({
  annotationManager,
  updateSelection,
  annotation,
  viewarApi: { sceneManager, cameras },
}) => async () => {
  await annotationManager.reset();
  await cameras.arCamera.hidePointCloud();
  sceneManager.off('selectionChanged', updateSelection);
};

export const updateSelection = ({ setDescriptionVisible }) => instance => {
  setDescriptionVisible(!!instance);
};

export const showRateOverlay = ({ setRateOverlayVisible }) => () =>
  setRateOverlayVisible(true);

export const closeRateOverlay = ({
  setLoading,
  rating,
  backPath,
  backArgs,
  goTo,
  goToLastView,
  setRateOverlayVisible,
}) => success => {
  setLoading(true);
  if (rating !== undefined) {
    // TODO: Save rating
  }
  setLoading(false);

  if (success) {
    goToLastView();
  } else {
    goTo('/call', {
      backPath,
      backArgs,
    });
  }
};

export const rateAnnotation = ({ setRating }) => rating => {
  setRating(rating);
};

export const updateTracking = ({
  setTracking,
  viewarApi: { sceneManager, tracker },
}) => () => {
  let tracking = true;
  if (tracker.loadTrackingMap) {
    tracking = tracker.targets.filter(
      target => target.type === 'map' && target.tracked
    ).length;
  }

  sceneManager.scene.setVisible(tracking);
  setTracking(tracking);
};

export default compose(
  withTrackingMap,
  withDialogControls,
  withSetLoading,
  withState('annotation', 'setAnnotation', undefined),
  withState('rating', 'setRating', undefined),
  withState('descriptionVisible', 'setDescriptionVisible', false),
  withState('rateOverlayVisible', 'setRateOverlayVisible', false),
  withState('tracking', 'setTracking', false),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationManager,
    annotationDb,
  }),
  withRouteParams(),
  withHandlers({
    updateSelection,
    updateTracking,
  }),
  withHandlers({
    init,
    destroy,
    showRateOverlay,
    closeRateOverlay,
    rateAnnotation,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    async componentWillUnmount() {
      await this.props.destroy();
    },
  })
)(Annotation);
