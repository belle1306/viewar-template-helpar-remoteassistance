import React from 'react';
import cx from 'classnames';

import styles from './logo.scss';
import global from '../../../css/global.scss';

export default ({ className, onClick }) => (
  <div
    className={cx(global.LogoImage, styles.Logo, className)}
    onClick={onClick}
  />
);
