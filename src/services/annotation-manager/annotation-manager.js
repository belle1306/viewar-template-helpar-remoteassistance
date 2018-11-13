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
  let userModel = null; // Use model with foreign key 'helpar_user_highlight' as user model, if not existing take first.
  let instances = {};
  let userInstance = {};
  let current = false;
  let freezeFrame;
  let screenshot;
  let saved = [];

  //--------------------------------------------------------------------------------------------------------------------
  // PUBLIC METHODS
  //--------------------------------------------------------------------------------------------------------------------

  const init = async onProgress => {
    if (initialized) {
      await reset();
    } else {
      const { modelManager } = viewarApi;

      const category = getCategory();
      if (category) {
        for (let model of category.children) {
          models[model.id] = model;
          if (model.foreignKey === 'helpar_user_highlight') {
            userModel = model;
          }
        }

        if (!userModel) {
          userModel = Object.values(models)[0];
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
          if (model === userModel) {
            userInstance = await insertModel(model, {
              id: `UserAnnotation${model.id}`,
              visible: false,
            });
          }
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
    await userInstance.setVisible(false);

    saved = [];
  };

  const setAnnotation = async (spec = {}, user) => {
    const { model, pose } = spec;

    if (user) {
      await userInstance.setPose(pose);
      await userInstance.setVisible(true);
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
    if (hits.ray) {
      position = await getPosition(hits);
    }

    if (!position && hits.featurePoints.length) {
      position = hits.featurePoints[0].intersection;
    }

    if (viewarApi.coreInterface.platform === 'Mock') {
      position = {x: 0, y: 0, z: 0};
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

  //--------------------------------------------------------------------------------------------------------------------
  // PRIVATE METHODS
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Calculate position with ray casted onto plane defined by nearest three featurepoints.
   */
  const getPosition = async hits => {
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
  const getFeaturePointPlane = featurePoints => {
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

    get current() {
      return current;
    },
    get currentUser() {
      return userInstance.visible
        ? {
            model: userInstance.model.id,
            pose: userInstance.pose,
          }
        : null;
    },

    get models() {
      return Object.values(models);
    },
    get saved() {
      return saved;
    },
  };
};
