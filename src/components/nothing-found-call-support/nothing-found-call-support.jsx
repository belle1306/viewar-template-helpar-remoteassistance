import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './nothing-found-call-support.scss';
import global from '../../../css/global.scss';

import { CallSupportButton } from '../';

export default ({ callSupport, className, hidden }) => (
  <div className={cx(styles.Call, hidden && styles.isHidden)}>
    <div className={styles.CallMessage}>
      {translate('NothingFoundCallSupport')}
    </div>
    <CallSupportButton
      className={styles.CallButton}
      callSupport={callSupport}
    />
  </div>
);
