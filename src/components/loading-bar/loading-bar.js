import React from 'react';
import cx from 'classnames';

import styles from './loading-bar.css';
import global from '../../../css/global.css';

export default ({ visible, progress }) => (
  <div className={cx(styles.LoadingBar, !visible && styles.isHidden)}>
    <div className={cx(styles.ProgressBar)}>
      <span
        className={cx(styles.Progress)}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
