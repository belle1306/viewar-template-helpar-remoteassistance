import React from 'react';
import cx from 'classnames';

import styles from './tag.css';
import global from '../../../css/global.css';

export default ({ className, onClick, label }) => (
  <div
    className={cx(styles.Tag, className)}
    onClick={() => onClick && onClick()}
  >
    <div className={styles.Label}>
      {label}
    </div>
  </div>
);
