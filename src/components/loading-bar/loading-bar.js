import React from 'react';
import cx from 'classnames';

import styles from './loading-bar.scss';
import global from '../../../css/global.scss';

export default ({ visible, progress }) => (
  <div className={cx(styles.LoadingBar, !visible && styles.isHidden)}>
    <div className={cx(styles.ProgressBar)}>
      <span className={cx(styles.Progress)} style={{ width: `${progress}%` }} />
    </div>
  </div>
);
