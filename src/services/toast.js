import pubSub from './pub-sub';

import { compose, withHandlers, withProps, withState, lifecycle } from 'recompose';

const show = ({ setVisible, setTimeout, setContent, setShowIcon }) => ({
  content,
  closeAfter = 3000,
  showIcon = true,
}) => {
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
