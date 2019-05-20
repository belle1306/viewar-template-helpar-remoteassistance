import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './call-support-button.scss';
import global from '../../../css/global.scss';

export default ({ callSupport, hidden, className }) => (
  <div
    className={cx(
      styles.CallButton,
      global.ButtonColor,
      hidden && styles.isHidden,
      className
    )}
    onClick={callSupport}
  >
    <div className={cx(styles.CallButtonIcon, global.ButtonImage)} />
    <div className={styles.CallButtonText}>
      {translate('NothingFoundCallSupportButton')}
    </div>
  </div>
);
