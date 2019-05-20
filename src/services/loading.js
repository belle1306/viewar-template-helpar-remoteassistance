import pubSub from './pub-sub';

import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';

const load = ({
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
  const {
    withProgress = false,
    opaque = false,
    progress = 0,
    prefix = '',
    message,
  } = args;
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
