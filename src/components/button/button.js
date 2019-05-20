import React from 'react';
import cx from 'classnames';

import styles from './button.scss';
import global from '../../../css/global.scss';

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
  active,
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
      {active && <div className={styles.Border} />}
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
