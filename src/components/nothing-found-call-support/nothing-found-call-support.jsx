import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './nothing-found-call-support.css';
import global from '../../../css/global.css';

export default ({ callSupport, className, hidden }) => (
  <div className={cx(styles.Call, hidden && styles.isHidden)}>
    <div className={styles.CallMessage}>
      {translate('NothingFoundCallSupport')}
    </div>
    <div
      className={cx(styles.CallButton, global.ButtonColor)}
      onClick={callSupport}
    >
      <div className={cx(styles.CallButtonIcon, global.ButtonImage)} />
      <div className={styles.CallButtonText}>
        {translate('NothingFoundCallSupportButton')}
      </div>
    </div>
  </div>
);
