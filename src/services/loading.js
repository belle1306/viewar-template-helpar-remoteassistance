import pubSub from './pub-sub';

import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';

export const load = ({
  setLoading,
  setProgress,
  setMessage,
  setWithProgress,
  setOpaque,
}) => ({ loading, progress = 0, withProgress = false, message, opaque }) => {
  setLoading(loading);
  setProgress(progress);
  setWithProgress(withProgress);
  setMessage(message);
  setOpaque(opaque);
};

export const withLoading = (prefix = '') =>
  compose(
    withState('loading', 'setLoading', false),
    withState('message', 'setMessage', null),
    withState('progress', 'setProgress', 0),
    withState('withProgress', 'setWithProgress', false),
    withState('opaque', 'setOpaque', false),
    withHandlers({
      load,
    }),
    lifecycle({
      async componentDidMount() {
        pubSub.subscribe(prefix + 'loadingState', this.props.load);
      },
    })
  );

const setLoading = ({ pubSub }) => (value, args = {}) => {
  const { withProgress = false, opaque = false, progress = 0, prefix = '', message } = args;
  pubSub.publish(prefix + 'loadingState', {
    loading: value,
    progress,
    withProgress,
    message,
    opaque,
  });
};

export const withSetLoading = compose(
  withProps({ pubSub }),
  withHandlers({
    setLoading,
  })
);

//======================================================================================================================

export const show = ({
  setVisible,
  visible,
  setTimeout,
  setContent,
  setShowIcon,
}) => ({ content, closeAfter = 3000, showIcon = true }) => {
  setContent(content);
  setVisible(true);
  setShowIcon(showIcon);
  setTimeout(() => setVisible(false), closeAfter);
};

export const withToast = (prefix = '') =>
  compose(
    withState('content', 'setContent', ''),
    withState('showIcon', 'setShowIcon', true),
    withState('visible', 'setVisible', false),
    withProps({
      setTimeout,
    }),
    withHandlers({
      show,
    }),
    lifecycle({
      async componentDidMount() {
        pubSub.subscribe(prefix + 'toast', this.props.show);
      },
    })
  );

const setToast = ({ pubSub }) => (content, duration, showIcon, prefix = '') =>
  pubSub.publish(prefix + 'toast', { content, closeAfter: duration, showIcon });

export const withSetToast = compose(
  withProps({ pubSub }),
  withHandlers({
    setToast,
  })
);
