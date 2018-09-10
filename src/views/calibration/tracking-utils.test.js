import test from 'tape';
import 'ignore-styles';

import {
  getTracker,
  usesTrackingMap,
  usesFloorOffsetModel,
  usesSimpleGroundConfirm,
  initTracking,
  activateARCamera,
  insertFloorOffsetModel,
  removeFloorOffsetModel,
  scaleFloorOffsetModel,
  FLOOR_MODEL_ID,
  FLOOR_MODEL_FALLBACK_ID,
  FLOOR_MODEL_FOREIGN_KEY,
  DEFAULT_POSE,
} from './tracking-utils';

test('Calibration - getTracker returns the first tracker from the tracker list', assert => {
  const trackers = {
    ARKit: Symbol('ARKit'),
    Placenote: Symbol('Placenote'),
  };

  const expected = trackers.ARKit;
  const actual = getTracker({ trackers });
  assert.equals(actual, expected);

  assert.end();
});

test('Calibration - getTracker returns null if tracker list is emptry', assert => {
  const trackers = {};

  const expected = null;
  const actual = getTracker({ trackers });
  assert.equals(actual, expected);

  assert.end();
});

test('Calibration - usesTrackingMap detects tracker with tracking map functionality', assert => {
  const tracker = {
    loadTrackingMap: true,
  };

  const expected = true;
  const actual = usesTrackingMap(tracker);
  assert.equals(actual, expected);

  assert.end();
});

test('Calibration - usesTrackingMap detects tracker with no tracking map functionality', assert => {
  const tracker = {};

  const expected = true;
  const actual = usesTrackingMap(tracker);
  assert.notEquals(actual, expected);

  assert.end();
});

test('Calibration - usesTrackingMap does not fail when no tracker is given.', assert => {
  const expected = true;
  const actual = usesTrackingMap();
  assert.notEquals(actual, expected);

  assert.end();
});

test('Calibration - usesFloorOffsetModel detects tracker with tracking map functionality', assert => {
  const tracker = {
    setFloorOffset: true,
  };

  const expected = true;
  const actual = usesFloorOffsetModel(tracker);
  assert.equals(actual, expected);

  assert.end();
});

test('Calibration - usesFloorOffsetModel detects tracker with no tracking map functionality', assert => {
  const tracker = {};

  const expected = true;
  const actual = usesFloorOffsetModel(tracker);
  assert.notEquals(actual, expected);

  assert.end();
});

test('Calibration - usesFloorOffsetModel does not fail when no tracker is given.', assert => {
  const expected = true;
  const actual = usesFloorOffsetModel();
  assert.notEquals(actual, expected);

  assert.end();
});

test('Calibration - usesSimpleGroundConfirm detects tracker with tracking map functionality', assert => {
  const tracker = {
    confirmGroundPosition: true,
  };

  const expected = true;
  const actual = usesSimpleGroundConfirm(tracker);
  assert.equals(actual, expected);

  assert.end();
});

test('Calibration - usesSimpleGroundConfirm detects tracker with no tracking map functionality', assert => {
  const tracker = {};

  const expected = true;
  const actual = usesSimpleGroundConfirm(tracker);
  assert.notEquals(actual, expected);

  assert.end();
});

test('Calibration - usesSimpleGroundConfirm does not fail when no tracker is given.', assert => {
  const expected = true;
  const actual = usesSimpleGroundConfirm();
  assert.notEquals(actual, expected);

  assert.end();
});

test('Calibration - initTracking resets the tracker', async assert => {
  const tracker = {
    reset: async () => assert.pass(),
  };

  assert.plan(1);
  await initTracking(tracker);
  assert.end();
});

test('Calibration - activateARCamera activates the AR camera', async assert => {
  const cameras = {
    arCamera: {
      activate: async () => assert.pass(),
    },
  };

  assert.plan(1);
  await activateARCamera({ cameras });
  assert.end();
});

test('Calibration - insertFloorOffsetModel inserts a model with foreign key', async assert => {
  const floorModel = Symbol();

  const modelsByForeignKey = {};
  modelsByForeignKey[FLOOR_MODEL_FOREIGN_KEY] = floorModel;

  const modelManager = {
    findModelByForeignKey: foreignKey => modelsByForeignKey[foreignKey],
  };

  const sceneManager = {
    insertModel: model => assert.equals(model, floorModel),
  };

  assert.plan(1);
  await insertFloorOffsetModel({ modelManager, sceneManager });
  assert.end();
});

test('Calibration - insertFloorOffsetModel inserts a fallback model if foreign key not found', async assert => {
  const floorFallbackModel = Symbol();

  const modelsByForeignKey = {};
  const modelsById = {};
  modelsById[FLOOR_MODEL_FALLBACK_ID] = floorFallbackModel;

  const modelManager = {
    findModelByForeignKey: foreignKey => modelsByForeignKey[foreignKey],
    getModelFromRepository: async id => modelsById[id],
  };

  const sceneManager = {
    insertModel: model => assert.equals(model, floorFallbackModel),
  };

  assert.plan(1);
  await insertFloorOffsetModel({ modelManager, sceneManager });
  assert.end();
});

test('Calibration - insertFloorOffsetModel inserts a model with the correct id', async assert => {
  const floorModel = Symbol();

  const modelsByForeignKey = {};
  modelsByForeignKey[FLOOR_MODEL_FOREIGN_KEY] = floorModel;

  const modelManager = {
    findModelByForeignKey: foreignKey => modelsByForeignKey[foreignKey],
  };

  const sceneManager = {
    insertModel: (model, args) => assert.equals(args.id, FLOOR_MODEL_ID),
  };

  assert.plan(1);
  await insertFloorOffsetModel({ modelManager, sceneManager });
  assert.end();
});

test('Calibration - insertFloorOffsetModel inserts a model at the default pose', async assert => {
  const floorModel = Symbol();

  const modelsByForeignKey = {};
  modelsByForeignKey[FLOOR_MODEL_FOREIGN_KEY] = floorModel;

  const modelManager = {
    findModelByForeignKey: foreignKey => modelsByForeignKey[foreignKey],
  };

  const sceneManager = {
    insertModel: (model, args) => assert.equals(args.pose, DEFAULT_POSE),
  };

  assert.plan(1);
  await insertFloorOffsetModel({ modelManager, sceneManager });
  assert.end();
});

test('Calibration - removeFloorOffsetModel removes the floor instance', async assert => {
  const floorInstance = Symbol();

  const instancesById = {};
  instancesById[FLOOR_MODEL_ID] = floorInstance;

  const sceneManager = {
    findNodeById: id => instancesById[id],
    removeNode: node => assert.equals(node, floorInstance),
  };

  assert.plan(1);
  await removeFloorOffsetModel({ sceneManager });
  assert.end();
});

test("Calibration - removeFloorOffsetModel does nothing if floor instance doesn't exist", async assert => {
  const instancesById = {};

  const sceneManager = {
    findNodeById: id => instancesById[id],
    removeNode: node => assert.fail(),
  };

  await removeFloorOffsetModel({ sceneManager });
  assert.end();
});

test('Calibration - scaleFloorOffsetModel adds a factor to existing scaling', async assert => {
  const factor = 100;
  const initialScale = 100;

  const tracker = {
    floorOffset: initialScale,
    setFloorOffset: offset => assert.equals(initialScale + factor, offset),
  };

  assert.plan(1);
  await scaleFloorOffsetModel(tracker, factor);
  assert.end();
});
