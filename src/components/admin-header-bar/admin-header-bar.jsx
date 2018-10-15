import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import Button from '../../components/button/button';

import styles from './admin-header-bar.css';
import global from '../../../css/global.css';

export default ({
  logOut,
  userName,
  className,
}) => (
  <div className={cx(styles.Container, className)}>
    <Button icon="account" className={styles.Avatar} />
    <div className={styles.UserDetails}>
      <div className={styles.UserWelcome}>{translate('AdminWelcome')}</div>
      <div className={styles.UserName}>{userName}</div>
    </div>
    <Button icon="logout" small onClick={logOut} className={styles.LogOutButton} />
  </div>
);
