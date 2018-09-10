import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './button-with-text.css';
import global from '../../../css/global.css';

import Button from '../button/button';

export default ({
  hidden,
  label,
  className,
  buttonClassName,
  onClick,
  ...props
}) => (
  <div
    className={cx(styles.ButtonWithText, hidden && styles.isHidden, className)}
    onClick={onClick}
  >
    <Button {...props} className={cx(styles.Button, buttonClassName)} />
    {label && <div className={styles.Label}>{translate(label)}</div>}
  </div>
);
