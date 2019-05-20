import { compose, withHandlers } from 'recompose';

import template from './text-input.jsx';

const handleSubmit = ({ onSubmit }) => event => {
  onSubmit && onSubmit();
  event.preventDefault();
};

export default compose(
  withHandlers({
    handleSubmit,
  })
)(template);
