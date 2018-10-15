import {
  compose,
  withProps,
  withHandlers,
  withState,
  withPropsOnChange,
} from 'recompose';
import annotationManager from '../../services/annotation-manager';
import { withSetLoading } from '../../services/loading';

import AnnotationPicker from './annotation-picker.jsx';

export const touch = ({
  setLoading,
  selected,
  annotationManager,
}) => async event => {
  if (selected) {
    setLoading(true);

    let x, y;
    if (event.type === 'click') {
      x = event.clientX / event.target.offsetWidth;
      y = event.clientY / event.target.offsetHeight;
    }

    if (x !== undefined && y !== undefined) {
      await annotationManager.setTouchAnnotation({ model: selected, x, y });
    }

    setLoading(false);
  }
};

export const confirm = ({ onClose }) => () => {
  onClose(true);
};

export const cancel = ({
  annotationManager,
  previous,
  setLoading,
  onClose,
}) => () => {
  setLoading(true);
  annotationManager.setAnnotation(previous);
  setLoading(false);

  onClose(false);
};

export default compose(
  withSetLoading,
  withState('selected', 'setSelected', null),
  withProps({
    annotationManager,
  }),
  withProps(({ annotationManager }) => ({
    models: annotationManager.models,
  })),
  withPropsOnChange(['visible'], ({ models, setSelected, selected, annotationManager, visible }) => {
    if (!selected && models.length) {
      setSelected(models[0].id);
    }

    const previousAnnotation = visible ? annotationManager.current : null;

    return {
      visible,
      previousAnnotation,
    };
  }),
  withHandlers({
    touch,
    confirm,
    cancel,
  })
)(AnnotationPicker);
