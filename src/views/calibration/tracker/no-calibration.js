import React from 'react';
import { compose, pure, lifecycle, withState, withProps } from 'recompose';
import { withSetLoading } from '../../../services/loading';

import viewarApi from 'viewar-api';

import { initTracking, activateARCamera } from '../tracking-utils';

export default compose(
  withSetLoading,
  withState('loadingVisible', 'setLoadingVisible', true),
  withProps({
    initTracking,
    activateARCamera,
  }),
  lifecycle({
    async componentWillMount() {
      const {
        setLoading,
        initTracking,
        activateARCamera,
        goToNext,
      } = this.props;

      setLoading(true);
      await activateARCamera(viewarApi);
      await initTracking(tracker);
      setLoading(false);

      goToNext();
    },
  }),
  pure
)(() => <div />);
