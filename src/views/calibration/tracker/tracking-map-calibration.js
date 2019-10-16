import {
  compose,
  pure,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import { withSetLoading } from '../../../services';

import viewarApi from 'viewar-api';

import template from './tracking-map-calibration.jsx';

import {
  initTracking,
  activateARCamera,
  getDeviceType,
} from '../tracking-utils.js';

export default compose(
  withSetLoading,
  withState('loadingVisible', 'setLoadingVisible', true),
  withState('deviceType', 'setDeviceType', null),
  withProps(() => ({
    getDeviceType,
    initTracking,
    activateARCamera,
    trackerName: viewarApi.tracker.name,
  })),
  withHandlers({
    onTrackingChanged: ({
      setLoading,
      tracker,
      onTrackingChanged,
      goToNext,
    }) => async () => {
      if (tracker.tracking) {
        setLoading(true, { opaque: true });

        tracker.off('trackingTargetStatusChanged', onTrackingChanged);
        await tracker.confirmGroundPosition();

        setLoading(false);

        goToNext();
      }
    },
  }),
  withHandlers({
    goBack: ({ goToLastView, tracker, onTrackingChanged }) => () => {
      tracker.off('trackingTargetStatusChanged', onTrackingChanged);
      goToLastView();
    },
  }),
  lifecycle({
    async componentWillMount() {
      const {
        getDeviceType,
        setDeviceType,
        setLoading,
        initTracking,
        activateARCamera,
        tracker,
        onTrackingChanged,
      } = this.props;

      setDeviceType(getDeviceType(viewarApi));

      setLoading(true, { opaque: true });
      await activateARCamera(viewarApi);
      await initTracking(tracker);
      tracker.on('trackingTargetStatusChanged', onTrackingChanged);
      setLoading(false);
    },
  }),
  pure
)(template);
