import {
  compose,
  withHandlers,
  lifecycle,
  withState,
  withProps,
} from 'recompose';
import template from './draw-canvas.jsx';
import { sceneDraw } from '../../services';
import generateId from '../../utils/generate-id';

export const init = ({
  clear,
  setWidth,
  setMaterial,
  setMaterials,
  onScreenResize,
  getRefs,
  admin,
  sceneDraw,
  onDraw,
  drawOnMesh,
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
  sceneDraw.drawName = admin ? 'admin' : 'user';
  sceneDraw.drawOnMesh = drawOnMesh;
  sceneDraw.on('draw', onDraw);
  clear();
};

export const destroy = ({
  onDraw,
  onScreenResize,
  getRefs,
  sceneDraw,
}) => () => {
  const { canvas } = getRefs();

  sceneDraw.unregisterCanvas(canvas);
  sceneDraw.off('draw', onDraw);
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

export const handleConfirm = ({
  sceneDraw,
  onConfirm,
  admin,
  onSync,
}) => () => {
  if (admin) {
    // Sync drawing.
    const drawing = sceneDraw.currentDrawing;
    if (drawing) {
      onSync(drawing);
    }
    onConfirm();
  }
};

export const handleCancel = ({ sceneDraw, onCancel, admin, onSync }) => () => {
  if (admin) {
    // Sync drawing.
    const drawing = sceneDraw.currentDrawing;
    if (drawing) {
      sceneDraw.removeDrawing(drawing);
    }
    onCancel();
  }
};

export const onDraw = ({ admin, sceneDraw, onSync }) => drawing => {
  if (!admin) {
    onSync(drawing);
  }
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
    onDraw,
  }),
  withHandlers({
    init,
    destroy,
    handleConfirm,
    handleCancel,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    },
  })
)(template);
