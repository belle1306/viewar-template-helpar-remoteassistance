import React from 'react';
import cx from 'classnames';

import styles from './logo.css';
import global from '../../../css/global.css';

export default ({ className, onClick }) => (
  <div
    className={cx(global.LogoImage, styles.Logo, className)}
    onClick={onClick}
  />
);
