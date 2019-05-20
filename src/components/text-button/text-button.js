import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './text-button.scss';
import global from '../../../css/global.scss';

export default ({
  label,
  round,
  inactive,
  large,
  hidden,
  className,
  onClick,
}) => (
  <div
    className={cx(
      styles.TextButton,
      global.ButtonColor,
      hidden && styles.isHidden,
      inactive && styles.isInactive,
      className
    )}
    onClick={() => !inactive && onClick && onClick()}
  >
    {translate(label)}
  </div>
);
