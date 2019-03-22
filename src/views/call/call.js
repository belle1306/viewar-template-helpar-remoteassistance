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
import sceneDraw from '../../services/scene-draw';
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
  topic,
  meshScan,
  viewarApi: { appConfig, tracker },
  setWaitingForSupportAgent,
  callClient,
  takeFreezeFrame,
  showFreezeFrame,
}) => async () => {
  let featureMap;
  if (!admin) {
    await connect();
    await joinSession({
      userData: {
        available: true,
        topic,
        timestamp: Date.now(),
      },
    });

    if (tracker) {
      if (tracker.saveTrackingMap) {
        featureMap = await tracker.generateTrackingMapId();
      }

      if (meshScan) {
        await tracker.startMeshScan();
      }
    }
  }

  if (callClient.connected && callClient.session) {
    syncAnnotationSubscription = callClient
      .getData('annotation')
      .subscribe(annotation => {
        annotationManager.setAnnotation(annotation, admin);
      });

    syncAnnotationSubscription = callClient
      .getData('drawing')
      .subscribe(drawing => {
        console.log('[Call] received drawing', drawing);
        sceneDraw.insertDrawing(drawing);
      });

    freezeFrameSubscription = callClient
      .getData('freezeFrame')
      .subscribe(showFreezeFrame);

    takeFreezeFrameSubscription = callClient
      .getData('takeFreezeFrame')
      .subscribe(takeFreezeFrame);

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
            meshScan: tracker && !!tracker.startMeshScan,
          },
        });
        setWaitingForSupportAgent(false);
      });
    }
  }
};

export const onTouch = ({
  syncAnnotation,
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

const toggleFreeze = ({
  setFreezeFrameSent,
  callClient,
  freezeFrame,
  setFreezeFrame,
  viewarApi: { cameras },
  frozen,
  setFrozen,
}) => () => {
  if (frozen) {
    cameras.arCamera.unfreeze();
    if (freezeFrame) {
      setFreezeFrameSent(false);
      callClient.sendData('freezeFrame', null);
      setFreezeFrame(false);
    }
  } else {
    cameras.arCamera.freeze();
  }
  setFrozen(!frozen);
};

const togglePerspective = ({
  viewarApi: { cameras },
  perspective,
  setPerspective,
}) => async () => {
  if (perspective) {
    cameras.arCamera.activate();
  } else {
    await cameras.perspectiveCamera.activate();
    await cameras.perspectiveCamera.zoomToFit();
  }

  setPerspective(!perspective);
};

const unpause = ({
  toggleFreeze,
  togglePerspective,
  perspective,
  frozen,
}) => () => {
  if (frozen) {
    toggleFreeze();
  } else if (perspective) {
    togglePerspective();
  }
};

const syncDrawing = ({ callClient, admin }) => drawing => {
  const { material, name, width } = drawing;
  const path = drawing.projectPathOntoPlane();

  const drawingData = {
    path,
    material: material.name,
    width,
    name,
  };

  if (admin) {
    annotationManager.saveDrawAnnotation(drawingData);
  }
  console.log('[Call] send drawing', drawingData);
  callClient.sendData('drawing', drawingData);
};

const saveFreezeFrame = ({
  callClient,
  freezeFrames,
  setFreezeFrames,
}) => async () => {
  // Notify user to take a freeze frame as well.
  const name = `freezeFrame-${Math.round(+new Date() / 1000)}`;
  callClient.sendData('takeFreezeFrame', name);

  // Take freeze frame.
  const freezeFrame = await viewarApi.cameras.arCamera.saveFreezeFrame(name);
  freezeFrames.push(freezeFrame);
  setFreezeFrames(freezeFrames);
};

const loadFreezeFrame = ({
  setFrozen,
  setFreezeFrame,
}) => async freezeFrame => {
  await viewarApi.cameras.arCamera.showFreezeFrame(freezeFrame);
  setFrozen(true);
  setFreezeFrame(freezeFrame);
};

const sendFreezeFrame = ({
  setFreezeFrameSent,
  freezeFrame,
  callClient,
}) => () => {
  // Notify user to show freeze frame.
  callClient.sendData('freezeFrame', freezeFrame.name);
  setFreezeFrameSent(true);
};

const showFreezeFrame = ({ freezeFrames }) => name => {
  // Triggered on user device via 'showFreezeFrame' call command.
  if (name) {
    const freezeFrame = freezeFrames.find(
      freezeFrame => freezeFrame.name === name
    );
    if (freezeFrame) {
      viewarApi.cameras.arCamera.showFreezeFrame(freezeFrame);
    } else {
      console.error(`No freezeFrame found with name '${name}'`);
    }
  } else {
    viewarApi.cameras.arCamera.unfreeze();
  }
};

const takeFreezeFrame = ({ freezeFrames, setFreezeFrame }) => async name => {
  // Triggered on user device via 'takeFreezeFrame' call command.
  const freezeFrame = await viewarApi.cameras.arCamera.saveFreezeFrame(name);
  freezeFrames.push(freezeFrame);
  setFreezeFrames(freezeFrames);
};

const toggleMuteSpeaker = ({ setSpeakerMuted, speakerMuted }) => () => {
  if (speakerMuted) {
    viewarApi.appUtils.unmuteSpeaker();
  } else {
    viewarApi.appUtils.muteSpeaker();
  }

  setSpeakerMuted(!speakerMuted);
};

const toggleMuteMicrophone = ({
  setMicrophoneMuted,
  microphoneMuted,
}) => () => {
  if (microphoneMuted) {
    viewarApi.appUtils.unmuteMicrophone();
  } else {
    viewarApi.appUtils.muteMicrophone();
  }

  setMicrophoneMuted(!microphoneMuted);
};

let takeFreezeFrameSubscription;
let freezeFrameSubscription;
let syncDrawingSubscription;
let syncAnnotationSubscription;
let syncSubscription;
let callSubscription;
let endCallSubscription;
export default compose(
  withTrackingMap,
  withCallClient,
  withDialogControls,
  withRouteParams(),
  withSetLoading,
  withState('speakerMuted', 'setSpeakerMuted', false),
  withState('microphoneMuted', 'setMicrophoneMuted', false),
  withState('freezeFrameSent', 'setFreezeFrameSent', false),
  withState('freezeFrame', 'setFreezeFrame', false),
  withState('freezeFrames', 'setFreezeFrames', []),
  withState('perspective', 'setPerspective', false),
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
    toggleFreeze,
    togglePerspective,
    showFreezeFrame,
    takeFreezeFrame,
  }),
  withHandlers({
    waitForSupportAgent,
    onTouch,
    closeAnnotationPicker,
    goBack,
    unpause,
    syncDrawing,
    saveFreezeFrame,
    loadFreezeFrame,
    sendFreezeFrame,
    toggleMuteSpeaker,
    toggleMuteMicrophone,
  }),
  lifecycle({
    async componentDidMount() {
      const {
        admin,
        waitForSupportAgent,
        annotationManager,
        meshScan,
        viewarApi: { cameras, tracker, appUtils },
      } = this.props;
      await annotationManager.reset();

      if (!admin && !meshScan) {
        await cameras.arCamera.showPointCloud();
      }

      appUtils.unmuteMicrophone();
      waitForSupportAgent();
    },
    async componentWillUnmount() {
      const {
        admin,
        callClient,
        setLoading,
        saveTrackingMap = async () => {
          console.error('Call view has no saveTrackingMap function.');
        },
        meshScan,
        viewarApi: { cameras, tracker },
      } = this.props;
      if (callSubscription) {
        callSubscription.unsubscribe();
      }
      if (syncAnnotationSubscription) {
        syncAnnotationSubscription.unsubscribe();
      }
      if (syncDrawingSubscription) {
        syncDrawingSubscription.unsubscribe();
      }
      if (endCallSubscription) {
        endCallSubscription.unsubscribe();
      }
      if (takeFreezeFrameSubscription) {
        takeFreezeFrameSubscription.unsubscribe();
      }
      if (freezeFrameSubscription) {
        freezeFrameSubscription.unsubscribe();
      }

      await callClient.endCall();
      if (!admin) {
        callClient.leave();

        setLoading(true);
        await saveTrackingMap();

        if (meshScan) {
          await tracker.stopMeshScan();
          await tracker.resetMeshScan();
        }

        setLoading(false);
        await cameras.arCamera.hidePointCloud();
      } else {
        callClient.setData({ available: false });
        await cameras.arCamera.unfreeze();
      }

      sceneDraw.clear();
      await cameras.perspectiveCamera.activate();
    },
  })
)(Call);
