import viewarApi from 'viewar-api';

import Plane from './math/plane';
import Vector3 from './math/vector3';
import Ray from './math/ray';
import throttle from 'lodash/throttle';
import { parseMaterialOptions, assign } from './utils';
import { createDrawing, NAME_PREFIX } from './drawing';
import makeEmitter from './emitter';

const UPDATE_INTERVAL = 50;

export default () => {
  const sceneDraw = makeEmitter({});

  const canvasRegistry = new Map();
  const activeDrawings = new Map();

  let drawings = [];
  let materialModelInstance;
  let materials = [];
  let material;
  let width = 6;
  let drawOnMesh = false;
  let drawName = null;

  //--------------------------------------------------------------------------------------------------------------------
  // PUBLIC MEMBERS
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Insert model with materials and get material options.
   */
  const initMaterials = async (specs = {}) => {
    const { foreignKey = 'draw_materials', modelId = '63846' } = specs;
    const { modelManager, sceneManager, coreInterface } = viewarApi;

    if (!materialModelInstance) {
      const model =
        modelManager.findModelByForeignKey(foreignKey) ||
        (await modelManager.getModelFromRepository(modelId));

      const rawDescription = await coreInterface.call(
        'prepareModelDescription',
        model.id
      );
      materials = parseMaterialOptions(rawDescription);

      materialModelInstance = await sceneManager.insertModel(model, {
        visible: false,
      });

      material = materials[1];
    }
  };

  const registerCanvas = canvas => {
    const id = canvas.id;

    if (!id) {
      console.error(
        `Invalid canvas provided: Make sure the canvas element's id is not empty.`
      );
    } else {
      canvasRegistry.set(id, canvas);
      registerInput(canvas);
    }
  };

  const unregisterCanvas = canvas => {
    const id = canvas.id;

    if (canvasRegistry.has(id)) {
      const canvas = canvasRegistry.get(id);
      unregisterInput(canvas);

      canvasRegistry.delete(id);
    }
  };

  const clear = async () => {
    await Promise.all(drawings.map(removeDrawing));
    drawings = [];
  };

  const insertDrawing = ({ path, material, width, name }) => {
    if (path.length > 1) {
      viewarApi.coreInterface.call(
        'draw',
        JSON.stringify({
          path,
          material,
          width,
          type: 'line',
          name,
        })
      );
    }
  };

  const removeDrawing = async drawing => {
    console.log('[SceneDraw] removeDrawing', drawing);
    await viewarApi.coreInterface.call('removeMesh', drawing.name);
  };

  //--------------------------------------------------------------------------------------------------------------------
  // PRIVATE MEMBERS
  //--------------------------------------------------------------------------------------------------------------------

  const registerInput = canvas => {
    canvas.addEventListener(
      'mousedown',
      throttle(handleMouseDown, UPDATE_INTERVAL)
    );
    canvas.addEventListener(
      'mouseup',
      throttle(handleMouseUp, UPDATE_INTERVAL)
    );
    canvas.addEventListener(
      'mousemove',
      throttle(handleMouseMove, UPDATE_INTERVAL)
    );
    canvas.addEventListener(
      'touchstart',
      throttle(handleTouchStart, UPDATE_INTERVAL)
    );
    canvas.addEventListener(
      'touchend',
      throttle(handleTouchEnd, UPDATE_INTERVAL)
    );
    canvas.addEventListener(
      'touchmove',
      throttle(handleTouchMove, UPDATE_INTERVAL)
    );
  };

  const unregisterInput = canvas => {
    canvas.removeEventListener(
      'mousedown',
      throttle(handleMouseDown, UPDATE_INTERVAL)
    );
    canvas.removeEventListener(
      'mouseup',
      throttle(handleMouseUp, UPDATE_INTERVAL)
    );
    canvas.removeEventListener(
      'mousemove',
      throttle(handleMouseMove, UPDATE_INTERVAL)
    );
    canvas.removeEventListener(
      'touchstart',
      throttle(handleTouchStart, UPDATE_INTERVAL)
    );
    canvas.removeEventListener(
      'touchend',
      throttle(handleTouchEnd, UPDATE_INTERVAL)
    );
    canvas.removeEventListener(
      'touchmove',
      throttle(handleTouchMove, UPDATE_INTERVAL)
    );
  };

  const handleMouseDown = e => {
    const id = e.target.id;
    const x = e.clientX;
    const y = e.clientY;

    startDrawing(id, x, y);
  };

  const handleMouseMove = e => {
    const id = e.target.id;
    const x = e.clientX;
    const y = e.clientY;

    updateDrawing(id, x, y);
  };

  const handleMouseUp = e => {
    const id = e.target.id;
    const x = e.clientX;
    const y = e.clientY;

    stopDrawing(id, x, y);
  };

  const handleTouchStart = e => {
    const id = e.target.id;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    startDrawing(id, x, y);
  };

  const handleTouchMove = e => {
    const id = e.target.id;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    updateDrawing(id, x, y);
  };

  const handleTouchEnd = e => {
    const id = e.target.id;

    stopDrawing(id);
  };

  /**
   * Start a new drawing.
   */
  const startDrawing = async (id, x, y) => {
    const canvas = canvasRegistry.get(id);

    if (canvas) {
      const drawing = createDrawing({
        canvas,
        material,
        width,
        useMesh: drawOnMesh,
        name: drawName,
      });
      await drawing.start(x, y);

      activeDrawings.set(id, drawing);
    } else {
      console.error(`[StartDrawing] Invalid canvas id ${id} provided.`);
    }
  };

  /**
   * Stop an existing drawing.
   */
  const stopDrawing = async (id, x, y) => {
    if (activeDrawings.has(id)) {
      const drawing = activeDrawings.get(id);

      await drawing.stop(x, y);
      draw3D(drawing);

      activeDrawings.delete(id);
      drawings.push(drawing);
    }
  };

  /**
   * Update an existing drawing.
   */
  const updateDrawing = (id, x, y) => {
    if (activeDrawings.has(id)) {
      const drawing = activeDrawings.get(id);
      drawing.update(x, y);
    }
  };

  /**
   * Send a drawing to the core to create a 3d representation.
   */
  const draw3D = async drawing => {
    const projectedPath = drawing.projectPathOntoPlane();
    console.log(`[SceneDraw] draw path`, drawing.name, projectedPath);

    if (projectedPath.length > 1) {
      viewarApi.coreInterface.call(
        'draw',
        JSON.stringify({
          path: projectedPath,
          material: material ? material.name : '42b5y9uuaqm',
          width: width,
          type: 'line',
          name: drawing.name,
        })
      );
    }

    sceneDraw.emit('draw', drawing);

    await new Promise(resolve => {
      setTimeout(() => resolve(), 200);
    });
    drawing.clearCanvas();
  };

  //--------------------------------------------------------------------------------------------------------------------
  // INTERFACE
  //--------------------------------------------------------------------------------------------------------------------

  return assign(sceneDraw, {
    initMaterials,
    registerCanvas,
    unregisterCanvas,
    clear,
    insertDrawing,
    removeDrawing,

    get drawings() {
      return drawings;
    },
    get materials() {
      return materials;
    },
    set material(newMaterial) {
      material = newMaterial;
    },
    get material() {
      return material;
    },
    set width(newWidth) {
      width = newWidth;
    },
    get width() {
      return width;
    },
    set drawOnMesh(newDrawOnMesh) {
      drawOnMesh = newDrawOnMesh;
    },
    get drawOnMesh() {
      return drawOnMesh;
    },
    set drawName(newDrawName) {
      drawName = NAME_PREFIX + newDrawName;
    },
    get drawName() {
      return drawName;
    },
    get currentDrawing() {
      // Only possible if drawName is set.
      return drawings.find(drawing => drawing.name === drawName);
    },
  });
};
