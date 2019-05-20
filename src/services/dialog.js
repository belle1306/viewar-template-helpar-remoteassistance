import pubSub from './pub-sub';

import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';

const load = ({
  setMessage,
  setVisible,
  setShowConfirm,
  setShowCancel,
  setConfirmText,
  setCancelText,
  setWithInput,
  setInput,
  onKeyDown,
  onConfirm,
  onCancel,
  setInputPlaceholder,
  setInputPassword,
}) => ({
  message,
  showConfirm,
  showCancel,
  confirmText,
  cancelText,
  withInput,
  input,
  inputPlaceholder,
  inputPassword,
}) => {
  setMessage(message);
  setShowConfirm(showConfirm);
  setShowCancel(showCancel);
  setConfirmText(confirmText);
  setCancelText(cancelText);
  setWithInput(withInput);
  setInput(input);
  setVisible(true);
  setInputPlaceholder(inputPlaceholder);
  setInputPassword(inputPassword);

  keyDownFunction = e => onKeyDown(e, onConfirm, onCancel);
  document.addEventListener('keydown', keyDownFunction);
};

export const onConfirm = ({ prefix, setVisible, input }) => () => {
  setVisible(false);
  pubSub.publish(prefix + 'closeDialog', { confirmed: true, input });

  document.removeEventListener('keydown', keyDownFunction);
  keyDownFunction = null;
};

export const onCancel = ({ prefix, setVisible }) => () => {
  setVisible(false);
  pubSub.publish(prefix + 'closeDialog', { cancelled: true });

  document.removeEventListener('keydown', keyDownFunction);
  keyDownFunction = null;
};

export const onKeyDown = () => (e, onConfirm, onCancel) => {
  if (e) {
    if (e.key === 'Enter') {
      onConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  }
};

let keyDownFunction = null;
export const withDialog = (prefix = '') =>
  compose(
    withProps({
      prefix,
    }),
    withState('message', 'setMessage', false),
    withState('showConfirm', 'setShowConfirm', true),
    withState('showCancel', 'setShowCancel', false),
    withState('confirmText', 'setConfirmText', 'DialogConfirm'),
    withState('cancelText', 'setCancelText', 'DialogCancel'),
    withState('withInput', 'setWithInput', false),
    withState('inputPlaceholder', 'setInputPlaceholder', false),
    withState('input', 'setInput', ''),
    withState('inputPassword', 'setInputPassword', false),
    withState('visible', 'setVisible', false),
    withHandlers({
      onConfirm,
      onCancel,
    }),
    withHandlers({
      onKeyDown,
    }),
    withHandlers({
      load,
    }),
    lifecycle({
      async componentDidMount() {
        pubSub.subscribe(prefix + 'showDialog', this.props.load);
      },
    })
  );

const showDialog = ({ pubSub }) => (message, args = {}, prefix = '') => {
  const {
    showConfirm = true,
    showCancel = false,
    confirmText = 'DialogConfirm',
    cancelText = 'DialogCancel',
    withInput = false,
    input,
    inputPlaceholder,
    inputPassword,
  } = args;
  pubSub.publish(prefix + 'showDialog', {
    message,
    showConfirm,
    showCancel,
    confirmText,
    cancelText,
    withInput,
    input,
    inputPlaceholder,
    inputPassword,
  });
  return new Promise(resolve =>
    pubSub.subscribe(prefix + 'closeDialog', resolve)
  );
};

export const withDialogControls = compose(
  withProps({ pubSub }),
  withHandlers({
    showDialog,
  })
);
