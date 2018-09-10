import { compose, withHandlers } from 'recompose';

import TextInput from './text-input.jsx';

const handleSubmit = ({ onSubmit }) => event => {
  onSubmit && onSubmit();
  event.preventDefault();
};

export default compose(
  withHandlers({
    handleSubmit,
  })
)(TextInput);
