import React from 'react';
import cx from 'classnames';

import styles from './toolbar.scss';
import global from '../../../css/global.scss';

export default ({ hidden, className, children, position }) => (
  <div
    className={cx(
      styles.Container,
      'coui-noinput',
      className,
      position && styles[`position-${position}`],
      hidden && styles.hidden
    )}
  >
    {children}
  </div>
);
