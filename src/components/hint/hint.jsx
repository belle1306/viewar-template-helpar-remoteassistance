import React from 'react';
import cx from 'classnames';

import styles from './hint.css';
import globalStyles from '../../../css/global.css';

export default ({ children, small, className }) => (
  <div className={cx(styles.Container, small && styles.Small, className)}>
    {children}
  </div>
);
