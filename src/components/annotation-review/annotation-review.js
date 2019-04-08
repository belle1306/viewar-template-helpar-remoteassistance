import {
  compose,
  withHandlers,
  withProps,
  withState,
  withPropsOnChange,
} from 'recompose';
import { withDialogControls } from '../../services/dialog';
import { withSetLoading } from '../../services/loading';
import withRouteParams from '../../services/route-params';

import AnnotationReview from './annotation-review.jsx';

export const createTag = ({ tags, setTags, tag, setTag }) => () => {
  if (tags.indexOf(tag) === -1 && tag) {
    tags.push(tag);
    setTags(tags);
  }
  setTag('');
};

export const removeTag = ({ setTags, tags }) => tag => {
  const index = tags.indexOf(tag);
  tags.splice(index, 1);
  setTags(tags);
};

export const handleSave = ({ createTag, save }) => () => {
  createTag();
  save();
};

export const save = ({ onSave, tags, description, title }) => () => {
  onSave({
    tags,
    description,
    title,
  });
};

export default compose(
  withDialogControls,
  withSetLoading,
  withRouteParams(),
  withState('fullscreenImage', 'setFullscreenImage', false),
  withState('title', 'setTitle', ''),
  withState('tag', 'setTag', ''),
  withState('tags', 'setTags', []),
  withState('description', 'setDescription', ''),
  withPropsOnChange(
    ['annotation', 'visible'],
    ({ annotation, visible, setDescription, setTitle, setTag, setTags }) => {
      if (annotation && visible) {
        setTitle(annotation.title || '');
        setTags(annotation.tags || []);
        setDescription(annotation.description || '');
        setTag('');
      }
    }
  ),
  withHandlers({
    createTag,
    save,
  }),
  withHandlers({
    removeTag,
    handleSave,
  })
)(AnnotationReview);
