import React from 'react';
import cx from 'classnames';

import styles from './button.css';
import global from '../../../css/global.css';

export default ({
  green,
  red,
  white,
  hidden,
  icon,
  large,
  small,
  medium,
  className,
  onClick,
  noBackground,
}) => (
  <div
    className={cx(
      styles.Container,
      large && styles.isLarge,
      medium && styles.isMedium,
      small && styles.isSmall,
      hidden && styles.isHidden,
      className
    )}
    onClick={() => onClick && onClick()}
  >
    <div className={cx(styles.Wrapper)}>
      {!noBackground && (
        <div className={cx(styles.Background, global.ButtonBackgroundColor)} />
      )}
      <div
        className={cx(
          green && styles.colorGreen,
          red && styles.colorRed,
          white && styles.colorWhite,
          styles.Button,
          global.ButtonColor,
          global.ButtonImage,
          styles[`icon-${icon}`]
        )}
      />
    </div>
  </div>
);
