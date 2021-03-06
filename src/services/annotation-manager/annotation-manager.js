import viewarApi from 'viewar-api';
import { generateId } from '../../utils';
import Plane from './math/plane';
import Quaternion from './math/quaternion';
import Vector3 from './math/vector3';
import Ray from './math/ray';
import {} from './math';

export default ({
  getCategory,
  getTouchResult,
  insertModel,
  takeFreezeFrame,
  takeScreenshot,
}) => {
  let initialized = false;
  let models = {};
  let instances = {};
  let userInstances = {};
  let current = false;
  let currentUser = false;
  let freezeFrame;
  let screenshot;
  let saved = [];

  //--------------------------------------------------------------------------------------------------------------------
  // PUBLIC METHODS
  //--------------------------------------------------------------------------------------------------------------------

  const init = async (onProgress) => {
    if (initialized) {
      await reset();
    } else {
      const { modelManager } = viewarApi;

      const category = await getCategory();
      if (category) {
        for (let model of category.children) {
          models[model.id] = model;
        }

        const count = {
          total: Object.keys(models).length * 2,
          current: 0,
          currentProgress: 0,
        };

        const updateProgress = (id, progress) => {
          if (!isNaN(progress * 1)) {
            count.currentProgress = progress;
            onProgress(count);
          }
        };

        modelManager.on('transferProgress', updateProgress);
        onProgress(count);

        for (let model of Object.values(models)) {
          // Download model.
          await model.download();
          count.current += 1;
          count.currentProgress = 0;
          onProgress(count);

          // Insert model.
          const instance = await insertModel(model, {
            id: `SupportAgentAnnotation${model.id}`,
            visible: false,
          });
          instances[model.id] = instance;

          userInstances[model.id] = await insertModel(model, {
            id: `UserAnnotation${model.id}`,
            visible: false,
          });
          onProgress(count);
        }

        modelManager.off('transferProgress', updateProgress);
      } else {
        console.error(`No categories with name 'annotations' found.`);
      }

      initialized = true;
    }
  };

  const reset = async () => {
    for (let instance of Object.values(instances)) {
      await instance.setVisible(false);
    }
    for (let instance of Object.values(userInstances)) {
      await instance.setVisible(false);
    }

    saved = [];
  };

  const setAnnotation = async (spec = {}, user) => {
    const { model, pose } = spec;

    if (user) {
      currentUser = false;

      for (let [id, instance] of Object.entries(userInstances)) {
        if (id === model) {
          await instance.setPose(pose);
          await instance.setVisible(true);

          currentUser = {
            pose,
            model,
          };
        } else {
          await instance.setVisible(false);
        }
      }
    } else {
      current = false;

      for (let [id, instance] of Object.entries(instances)) {
        if (id === model) {
          await instance.setPose(pose);
          await instance.setVisible(true);

          current = {
            pose,
            model,
          };
        } else {
          await instance.setVisible(false);
        }
      }
    }
  };

  const setTouchAnnotation = async ({ model, x, y }, user = false) => {
    const hits = await getTouchResult(x, y, 1000);

    let position;

    if (viewarApi.coreInterface.platform === 'Mock') {
      position = { x: 0, y: 0, z: 0 };
    }

    if (!position && hits.ray) {
      position = await getPosition(hits);
    }

    if (!position && hits.featurePoints.length) {
      position = hits.featurePoints[0].intersection;
    } else if (hits.instances.length) {
      const { x, y, z } = hits.instances[0].intersection[0];
      position = {
        x,
        y,
        z,
      };
    }

    if (!position && hits.floors && hits.floors.length) {
      position = hits.floors[0];
    }

    if (position) {
      if (user) {
        await setAnnotation({ model, pose: { position } }, user);
      } else {
        await setAnnotation({ model, pose: { position } }, user);
        // freezeFrame = await takeFreezeFrame();
        screenshot = await takeScreenshot();
      }
    }
  };

  const saveAnnotation = () => {
    saved.push(
      Object.assign({}, current, {
        freezeFrame,
        screenshot,
        id: generateId(),
      })
    );
  };

  const saveDrawAnnotation = async (drawing) => {
    screenshot = await takeScreenshot();

    saved.push(
      Object.assign(
        {},
        {
          drawing,
          freezeFrame,
          screenshot,
          id: generateId(),
        }
      )
    );
  };

  //--------------------------------------------------------------------------------------------------------------------
  // PRIVATE METHODS
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Calculate position with ray casted onto plane defined by nearest three featurepoints.
   */
  const getPosition = async (hits) => {
    const plane = getFeaturePointPlane(hits.featurePoints);
    if (plane) {
      const ray = new Ray(hits.ray);
      const { intersects, distance } = plane.getRayIntersection(ray);
      if (intersects) {
        return ray.origin.add(ray.direction.scale(distance));
      }
    }
  };

  /**
   * Get plane from three nearest feature points.
   */
  const getFeaturePointPlane = (featurePoints) => {
    if (featurePoints.length >= 3) {
      const p1 = new Vector3(featurePoints[0].position);
      const p2 = new Vector3(featurePoints[1].position);
      const p3 = new Vector3(featurePoints[2].position);

      return Plane.fromPoints(p1, p2, p3);
    }
  };

  //--------------------------------------------------------------------------------------------------------------------
  // INTERFACE
  //--------------------------------------------------------------------------------------------------------------------

  return {
    init,
    reset,
    setAnnotation,
    setTouchAnnotation,
    saveAnnotation,
    saveDrawAnnotation,

    get current() {
      return current;
    },
    get currentUser() {
      return currentUser;
    },

    get models() {
      return Object.values(models);
    },
    get saved() {
      return saved;
    },
  };
};
