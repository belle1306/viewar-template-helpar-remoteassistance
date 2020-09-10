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

export const NAME_PREFIX = 'drawing_';

export const createDrawing = ({
  canvas,
  material,
  width = 6,
  useMesh = false,
  name = generateId(),
}) => {
  const context = canvas.getContext('2d');
  context.strokeStyle = material.color;
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
    const touchResult = await viewarApi.sceneManager.simulateTouchRay(
      screenX,
      screenY,
      useMesh ? 0 : 100
    );
    const { instances, featurePoints, ray } = touchResult;

    // Calculate plane.
    if (useMesh) {
      // Filter drawing meshs.
      let filteredInstances = instances.filter(
        (instance) => !instance.meshid.startsWith(NAME_PREFIX)
      );
      if (filteredInstances.length) {
        // Create plane from intersection.
        const point = new Vector3(filteredInstances[0].intersection[0]);

        // const {normalX, normalY, normalZ } = filteredInstances[0].intersection[0];
        // const normal = new Vector3(normalX, normalY, normalZ);
        const normal = Vector3.Z_AXIS.rotate(pose.orientation);

        plane = Plane.fromNormalPoint(normal, point);
      } else {
        console.error('[Drawing] No mesh hit for plane.', touchResult);
        plane = Plane.XZ_PLANE;
      }
    } else {
      // Create plane from nearest featurepoint.
      if (featurePoints.length >= 1) {
        const point = new Vector3(featurePoints[0].position);
        plane = Plane.fromNormalPoint(Vector3.Z_AXIS.rotate(pose.orientation), point);
      } else {
        console.error('[Drawing] Not enough feature points for plane.', touchResult);
        plane = Plane.XZ_PLANE;
      }
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
      const { ray } = await viewarApi.sceneManager.simulateTouchRay(screenX, screenY, 0);

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
      const { ray } = await viewarApi.sceneManager.simulateTouchRay(screenX, screenY, 0);

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
