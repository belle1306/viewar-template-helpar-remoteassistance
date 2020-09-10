import pubSub from './pub-sub';
import { compose, withState, withProps, withHandlers, lifecycle } from 'recompose';
import viewarApi from 'viewar-api';

const doSaveTrackingMap = ({
  viewarApi: { tracker },
  setMessage,
  setProgress,
  setVisible,
}) => async () => {
  let featureMap = '';

  setMessage('TrackingMapSaveInProgress');

  if (tracker && tracker.saveTrackingMap) {
    setVisible(true);
    featureMap = await tracker.saveTrackingMap();
    setVisible(false);
  }

  setProgress(0);
  return featureMap;
};

const doLoadTrackingMap = ({
  viewarApi: { tracker },
  setMessage,
  setProgress,
  setVisible,
}) => async (trackingMapId) => {
  setMessage('TrackingMapLoadInProgress');

  if (tracker && tracker.saveTrackingMap) {
    setVisible(true);
    await tracker.loadTrackingMap(trackingMapId);
    setVisible(false);
  }

  setProgress(0);
};

const updateProgress = ({ setProgress }) => (progress) => {
  setProgress(progress * 100);
};

export const withTrackingMapProgress = () =>
  compose(
    withState('message', 'setMessage', 'TrackingMapSaveInProgress'),
    withState('visible', 'setVisible', false),
    withState('progress', 'setProgress', 0),
    withProps({
      viewarApi,
    }),
    withProps(() => ({})),
    withHandlers({
      updateProgress,
      doSaveTrackingMap,
      doLoadTrackingMap,
    }),
    lifecycle({
      componentDidMount() {
        const {
          doSaveTrackingMap,
          doLoadTrackingMap,
          updateProgress,
          viewarApi: { tracker },
        } = this.props;

        pubSub.subscribe(
          'trackingMap',
          async ({ saveTrackingMap, loadTrackingMap, trackingMapId }) => {
            if (saveTrackingMap) {
              await doSaveTrackingMap();
            } else if (loadTrackingMap) {
              await doLoadTrackingMap(trackingMapId);
            }
            pubSub.publish('trackingMapResult', {});
          }
        );

        if (tracker) {
          tracker.on('trackingMapSaveProgress', updateProgress);
          tracker.on('trackingMapLoadProgress', updateProgress);
        }
      },
    })
  );

const sendAndWaitForResult = ({ pubSub }) => async (args) => {
  await new Promise((resolve) => {
    pubSub.subscribe('trackingMapResult', () => resolve());
    pubSub.publish('trackingMap', args);
  });

  pubSub.unsubscribe('trackingMapResult');
};

const saveTrackingMap = ({ sendAndWaitForResult }) => async () => {
  await sendAndWaitForResult({ saveTrackingMap: true });
};

const loadTrackingMap = ({ sendAndWaitForResult }) => async (trackingMapId) => {
  await sendAndWaitForResult({ loadTrackingMap: true, trackingMapId });
};

export const withTrackingMap = compose(
  withProps({ pubSub }),
  withHandlers({
    sendAndWaitForResult,
  }),
  withHandlers({
    loadTrackingMap,
    saveTrackingMap,
  })
);
