export const DEFAULT_POSE = { position: { x: 0, y: 0, z: 0 } };
export const FLOOR_MODEL_ID = 'FloorOffsetInstance';
export const FLOOR_MODEL_FOREIGN_KEY = 'floor_offset';
export const FLOOR_MODEL_FALLBACK_ID = '40848';

// Placenote
export const usesTrackingMap = tracker => tracker && tracker.loadTrackingMap;

// Wikitude // not used atm
export const usesFloorOffsetModel = tracker =>
  tracker && tracker.setFloorOffset;

// ARKit, ARCore, 6D
export const usesSimpleGroundConfirm = tracker =>
  tracker && tracker.confirmGroundPosition;

export const initTracking = tracker => tracker && tracker.reset();

export const activateARCamera = ({ cameras }) =>
  cameras.arCamera && cameras.arCamera.activate();

export const getDeviceType = ({ appConfig }) => appConfig.deviceType;

export const insertFloorOffsetModel = async ({
  modelManager,
  sceneManager,
}) => {
  const model =
    modelManager.findModelByForeignKey(FLOOR_MODEL_FOREIGN_KEY) ||
    (await modelManager.getModelFromRepository(FLOOR_MODEL_FALLBACK_ID));
  if (model) {
    await sceneManager.insertModel(model, {
      id: FLOOR_MODEL_ID,
      pose: DEFAULT_POSE,
    });
  } else {
    console.error("Missing model 'floor_calibration' in model tree.");
  }
};

export const removeFloorOffsetModel = async ({ sceneManager }) => {
  const instance = sceneManager.findNodeById(FLOOR_MODEL_ID);
  instance && (await sceneManager.removeNode(instance));
};

export const scaleFloorOffsetModel = async (tracker, factor) =>
  tracker.setFloorOffset(tracker.floorOffset + factor);
