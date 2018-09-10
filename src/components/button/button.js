import React from 'react';
import cx from 'classnames';

import styles from './button.css';
import global from '../../../css/global.css';

export default ({ hidden, icon, large, small, medium, className, onClick }) => (
  <div
    className={cx(
      styles.Button,
      global.ButtonColor,
      global.ButtonImage,
      large && styles.isLarge,
      medium && styles.isMedium,
      small && styles.isSmall,
      styles[`icon-${icon}`],
      hidden && styles.isHidden,
      className
    )}
    onClick={() => onClick && onClick()}
  />
);
