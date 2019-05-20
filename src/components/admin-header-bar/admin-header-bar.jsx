import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import { Button } from '../';

import styles from './admin-header-bar.scss';
import global from '../../../css/global.scss';

export default ({ logOut, userName, className }) => (
  <div className={cx(styles.Container, className)}>
    <Button icon="account" className={styles.Avatar} white noBackground />
    <div className={styles.UserDetails}>
      <div className={styles.UserWelcome}>{translate('AdminWelcome')}</div>
      <div className={styles.UserName}>{userName}</div>
    </div>
    <Button
      icon="logout"
      small
      onClick={logOut}
      className={styles.LogOutButton}
      noBackground
    />
  </div>
);
