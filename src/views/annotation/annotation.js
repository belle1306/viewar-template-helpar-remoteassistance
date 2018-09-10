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

import Annotation from './annotation.jsx';

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
  viewarApi: { sceneManager, trackers },
}) => async () => {
  setLoading(true);

  const annotation = await annotationDb.get(annotationId);

  if (annotation.model) {
    annotationManager.setAnnotation(annotation, false);
  }

  if (annotation.featureMap) {
    const tracker = Object.values(trackers)[0];
    if (tracker && tracker.loadTrackingMap) {
      tracker.on('trackingTargetStatusChanged', updateTracking);
      await tracker.loadTrackingMap(annotation.featureMap);
    }

    updateTracking();
  } else {
    setTracking(true);
  }

  sceneManager.on('selectionChanged', updateSelection);
  setLoading(false);
  setAnnotation(annotation);
};

export const destroy = ({
  annotationManager,
  updateSelection,
  annotation,
  viewarApi: { sceneManager },
}) => async () => {
  await annotationManager.reset();
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
  viewarApi: { sceneManager, trackers },
}) => () => {
  const tracker = Object.values(trackers)[0];

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
