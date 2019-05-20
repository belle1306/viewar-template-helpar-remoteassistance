import React from 'react';
import cx from 'classnames';

import styles from './tag.scss';
import global from '../../../css/global.scss';

export default ({ className, noDelete, onClick, label }) => (
  <div
    className={cx(styles.Tag, noDelete && styles.noDelete, className)}
    onClick={() => onClick && onClick()}
  >
    <div className={styles.Label}>{label}</div>
  </div>
);
