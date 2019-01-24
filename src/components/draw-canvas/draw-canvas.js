import {
  compose,
  withHandlers,
  lifecycle,
  withState,
  withProps,
} from 'recompose';
import DrawCanvas from './draw-canvas.jsx';
import sceneDraw from '../../services/scene-draw';
import generateId from '../../utils/generate-id';

export const init = ({
  clear,
  setWidth,
  setMaterial,
  setMaterials,
  onScreenResize,
  getRefs,
  canvasId,
  sceneDraw,
}) => () => {
  const { canvas } = getRefs();

  window.addEventListener('resize', onScreenResize);
  onScreenResize();

  canvas.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  setWidth(sceneDraw.width);
  setMaterials(sceneDraw.materials);
  setMaterial(sceneDraw.material);
  sceneDraw.registerCanvas(canvas);
  clear();
};

export const destroy = ({ onScreenResize, getRefs, sceneDraw }) => () => {
  const { canvas } = getRefs();

  sceneDraw.unregisterCanvas(canvas);
  window.removeEventListener('resize', onScreenResize);
};

export const createRefCalls = () => {
  const refs = {};
  return {
    getRefs: () => () => refs,
    addRef: () => name => ref => {
      refs[name] = ref;
    },
  };
};

export const onScreenResize = ({ getRefs }) => () => {
  const { canvas } = getRefs();
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
};

export const setRandomColor = ({ sceneDraw, setColor }) => () => {
  const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  sceneDraw.color = color;
  setColor(color);
};

export const updateMaterial = ({ sceneDraw, setMaterial }) => material => {
  sceneDraw.material = material;
  setMaterial(material);
};

export const updateWidth = ({ sceneDraw, setWidth }) => width => {
  sceneDraw.width = width;
  setWidth(width);
};

export const clear = ({ sceneDraw }) => () => {
  sceneDraw.clear();
};

export default compose(
  withState('materials', 'setMaterials', []),
  withState('material', 'setMaterial', ''),
  withState('width', 'setWidth', 0),
  withProps({
    sceneDraw,
    canvasId: generateId(),
  }),
  withHandlers(createRefCalls()),
  withHandlers({
    onScreenResize,
    setRandomColor,
    updateMaterial,
    updateWidth,
    clear,
  }),
  withHandlers({
    init,
    destroy,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    },
  })
)(DrawCanvas);
