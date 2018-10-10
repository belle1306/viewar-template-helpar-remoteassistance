import {
  compose,
  withHandlers,
  withState,
  lifecycle,
  withProps,
} from 'recompose';
import withCallClient from '../../services/call-client';
import viewarApi from 'viewar-api';
import { getUiConfigPath } from '../../utils';
import { withDialogControls } from '../../services/dialog';
import { withSetLoading } from '../../services/loading';
import annotationManager from '../../services/annotation-manager';
import { translate } from '../../services';
import withRouteParams from '../../services/route-params';
import { withTrackingMap } from '../../services/tracking-map';

import Call from './Call.jsx';

export const waitForSupportAgent = ({
  goToNextView,
  joinSession,
  showDialog,
  connect,
  history,
  admin,
  viewarApi: { appConfig, trackers },
  setWaitingForSupportAgent,
  callClient,
}) => async () => {
  let featureMap;
  if (!admin) {
    await connect();
    await joinSession({ userData: { available: true } });

    const tracker = Object.values(trackers)[0];
    if (tracker && tracker.saveTrackingMap) {
      featureMap = await tracker.generateTrackingMapId();
    }
  }

  if (callClient.connected && callClient.session) {
    syncSubscription = callClient
      .getData('annotation')
      .subscribe(annotation => {
        annotationManager.setAnnotation(annotation, admin);
      });

    endCallSubscription = callClient.endedCall.subscribe(async () => {
      goToNextView();

      await showDialog('MessageCallEnded', {
        confirmText: 'DialogOK',
      });
    });

    if (!admin) {
      setWaitingForSupportAgent(true);
      callSubscription = callClient.incomingCall.subscribe(async () => {
        await callClient.answerCall({
          syncScene: false,
          data: {
            featureMap,
          },
        });
        setWaitingForSupportAgent(false);
      });
    }
  }
};

export const onTouch = ({
  syncAnnotation,
  setLoading,
  annotationManager,
}) => async event => {
  let x, y;
  if (event.type === 'click') {
    x = event.clientX / event.target.offsetWidth;
    y = event.clientY / event.target.offsetHeight;
  }

  if (x !== undefined && y !== undefined) {
    await annotationManager.setTouchAnnotation({ x, y }, true);
    syncAnnotation();
  }
};

export const closeAnnotationPicker = ({
  syncAnnotation,
  annotationManager,
  setShowAnnotationPicker,
}) => confirmed => {
  setShowAnnotationPicker(false);
  if (confirmed) {
    syncAnnotation();
    annotationManager.saveAnnotation();
  }
};

export const syncAnnotation = ({
  annotationManager,
  callClient,
  admin,
}) => () => {
  const annotation = admin
    ? annotationManager.current
    : annotationManager.currentUser;
  if (annotation) {
    callClient.sendData('annotation', annotation);
  }
};

export const goBack = ({
  waitingForSupportAgent,
  goToNextView,
  admin,
  showDialog,
}) => async () => {
  if (waitingForSupportAgent) {
    goToNextView();
  } else {
    const { confirmed } = await showDialog('CallAbortQuestion', {
      showCancel: true,
      confirmText: 'CallAbortCall',
    });

    if (confirmed) {
      goToNextView();
    }
  }
};

export const goToNextView = ({
  annotationManager,
  admin,
  setLoading,
  featureMap,
  goTo,
  backPath,
  backArgs,
  goToLastView,
}) => async () => {
  if (admin) {
    if (annotationManager.saved.length) {
      goTo('/review', {
        backPath,
        backArgs,
        featureMap,
      });
    } else {
      goToLastView();
    }
  } else {
    goToLastView();
  }
};

const toggleFreeze = ({ viewarApi: { cameras }, frozen, setFrozen }) => () => {
  if (frozen) {
    cameras.arCamera.unfreeze();
  } else {
    cameras.arCamera.freeze();
  }
  setFrozen(!frozen);
};

let syncSubscription;
let callSubscription;
let endCallSubscription;
export default compose(
  withTrackingMap,
  withCallClient,
  withDialogControls,
  withRouteParams(),
  withSetLoading,
  withState('frozen', 'setFrozen', false),
  withState('waitingForSupportAgent', 'setWaitingForSupportAgent', false),
  withState('showAnnotationPicker', 'setShowAnnotationPicker', false),
  withProps({
    viewarApi,
    getUiConfigPath,
    annotationManager,
  }),
  withHandlers({
    syncAnnotation,
    goToNextView,
  }),
  withHandlers({
    waitForSupportAgent,
    onTouch,
    closeAnnotationPicker,
    goBack,
    toggleFreeze,
  }),
  lifecycle({
    async componentDidMount() {
      const {
        admin,
        waitForSupportAgent,
        annotationManager,
        viewarApi: { cameras },
      } = this.props;
      await annotationManager.reset();

      if (!admin) {
        await cameras.arCamera.showPointCloud();
      }

      waitForSupportAgent();
    },
    async componentWillUnmount() {
      const {
        admin,
        callClient,
        setLoading,
        saveTrackingMap = () => { console.error('Call view has no saveTrackingMap function.'); },
        viewarApi: { cameras },
      } = this.props;
      if (callSubscription) {
        callSubscription.unsubscribe();
      }
      if (syncSubscription) {
        syncSubscription.unsubscribe();
      }
      if (endCallSubscription) {
        endCallSubscription.unsubscribe();
      }

      callClient.endCall();
      if (!admin) {
        callClient.leave();

        setLoading(true);
        await saveTrackingMap();
        setLoading(false);
        await cameras.arCamera.hidePointCloud();
      } else {
        await cameras.arCamera.unfreeze();
      }

      await cameras.perspectiveCamera.activate();
    },
  })
)(Call);
