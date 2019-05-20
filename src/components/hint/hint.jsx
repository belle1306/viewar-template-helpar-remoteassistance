import React from 'react';
import cx from 'classnames';

import styles from './hint.scss';
import global from '../../../css/global.scss';

export default ({ children, small, className, hidden }) => (
  <div
    className={cx(
      styles.Container,
      small && styles.Small,
      hidden && styles.isHidden,
      className
    )}
  >
    {children}
  </div>
);
