import Ray from './math/ray';
import Plane from './math/plane';
import Quaternion from './math/quaternion';
import Vector3 from './math/vector3';
import viewarApi from 'viewar-api';
import { convertCanvasToScreenCoordinates } from './utils';
import generateId from '../../utils/generate-id';

const DEFAULT_RAY = {
  origin: { x: 0, y: 0, z: 0 },
  direction: { x: 0, y: 1, z: 0 },
};

export default (
  canvas,
  material,
  width = 6,
  color = '#FF0000',
  name = generateId()
) => {
  console.log(`[Drawing] new drawing: ${name}`);
  const context = canvas.getContext('2d');
  context.strokeStyle = color;
  context.lineWidth = width;

  let plane = null;
  let stopped = false;

  const path = [];

  //--------------------------------------------------------------------------------------------------------------------
  // PUBLIC MEMBERS
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Start a new drawing.
   */
  const start = async (x, y) => {
    // Get start pose.
    const pose = await viewarApi.cameras.arCamera.updatePose();

    // Simulate touch ray.
    const { x: screenX, y: screenY } = convertCanvasToScreenCoordinates(x, y);
    const {
      featurePoints,
      ray,
    } = await viewarApi.sceneManager.simulateTouchRay(screenX, screenY, 100);

    // Calculate plane.
    if (featurePoints.length >= 3) {
      const p1 = new Vector3(featurePoints[0].position);
      plane = Plane.fromNormalPoint(
        Vector3.Z_AXIS.rotate(pose.orientation),
        p1
      );
    } else {
      console.error('Not enough feature points for plane');
      plane = Plane.XZ_PLANE;
    }

    // Add start position to path.
    path.push({
      x,
      y,
      ray: new Ray(ray || DEFAULT_RAY),
    });
  };

  /**
   * Update current drawing with new positions.
   */
  const update = async (x, y) => {
    if (!stopped) {
      const { x: screenX, y: screenY } = convertCanvasToScreenCoordinates(x, y);
      const { ray } = await viewarApi.sceneManager.simulateTouchRay(
        screenX,
        screenY,
        0
      );

      // Add new position to path.
      path.push({
        x,
        y,
        ray: new Ray(ray || DEFAULT_RAY),
      });
    }

    // Redraw 2d representation.
    redraw();
  };

  /**
   * Stop the current drawing.
   */
  const stop = async (x, y) => {
    stopped = true;

    if (x !== undefined && y !== undefined) {
      // Get ray for the last recorded point.
      const { x: screenX, y: screenY } = convertCanvasToScreenCoordinates(x, y);
      const { ray } = await viewarApi.sceneManager.simulateTouchRay(
        screenX,
        screenY,
        0
      );

      // Add end position to path.
      path.push({
        x,
        y,
        ray: new Ray(ray || DEFAULT_RAY),
      });
    }

    // Redraw 2d representation.
    redraw();
  };

  //--------------------------------------------------------------------------------------------------------------------
  // PRIVATE MEMBERS
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Redraw 2d representation.
   */
  const redraw = () => {
    clearCanvas();

    context.beginPath();
    drawLinePath(context, path);
    context.stroke();
  };

  /**
   * Clear canvas.
   */
  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  };

  /**
   * Draw a path on a canvas.
   */
  const drawLinePath = (context, path) => {
    const { x: startX, y: startY } = path[0];
    context.moveTo(startX, startY);

    for (let i = 1; i < path.length; i++) {
      const { x, y } = path[i];
      context.lineTo(x, y);
    }
  };

  /**
   * Project the 2d coordinates from the path onto the 3d plane.
   */
  const projectPathOntoPlane = () => {
    return path.map(({ x, y, ray }) => {
      const { distance } = plane.getRayIntersection(ray);
      return ray.origin.add(ray.direction.scale(distance));
    });
  };

  //--------------------------------------------------------------------------------------------------------------------
  // INTERFACE
  //--------------------------------------------------------------------------------------------------------------------

  return {
    start,
    update,
    stop,
    clearCanvas,
    projectPathOntoPlane,

    get name() {
      return name;
    },
    get plane() {
      return plane;
    },
    get path() {
      return path;
    },
    get width() {
      return width;
    },
    get material() {
      return material;
    },
  };
};
