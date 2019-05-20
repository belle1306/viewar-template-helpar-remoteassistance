import React, { Fragment } from 'react';
import cx from 'classnames';
import { Spinner } from '../';
import { translate } from '../../services';

import styles from './loading-overlay.scss';
import global from '../../../css/global.scss';

import { Circle } from 'rc-progress';

export default ({ loading, withProgress, opaque, progress, message }) => (
  <div
    className={cx(
      styles.Container,
      global.OverlayBackgroundColor,
      loading && styles.visible,
      opaque && styles.opaque
    )}
  >
    {loading && !withProgress && (
      <Fragment>
        <Spinner />
      </Fragment>
    )}
    {loading && withProgress && (
      <div className={cx(styles.ProgressSpinner)}>
        <div className={cx(styles.Loading, global.ColorBright)}>
          {translate(message || 'SpinnerProgressText')}
        </div>
        <Circle
          key="circle"
          className={styles.Spinner}
          percent={progress}
          strokeWidth="8"
          strokeColor="white"
          trailWidth="4"
          trailColor="rgba(255,255,255,0.15)"
          gapPosition="bottom"
        />
      </div>
    )}
  </div>
);
