import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './nothing-found-call-support.css';
import globalStyles from '../../../css/global.css';

import Button from '../button/button';

export default ({ callSupport, className, hidden }) => (
  <div className={cx(styles.Call, hidden && styles.isHidden)}>
    <div className={styles.CallMessage}>
      {translate('NothingFoundCallSupport')}
    </div>
    <Button icon="call" className={styles.CallButton} onClick={callSupport} />
  </div>
);
