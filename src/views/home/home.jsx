import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './home.css';
import global from '../../../css/global.css';

import Logo from '../../components/logo/logo';
import TextButton from '../../components/text-button/text-button';
import Spinner from '../../components/spinner/spinner.jsx';
import Button from '../../components/button/button';
import CallSupportButton from '../../components/call-support-button/call-support-button';
import LoginDialog from '../../components/login-dialog/login-dialog';

export default ({
  goToProductSelection,
  goToUserSelection,
  loadingDone,
  callSupport,
  username,
  setUsername,
  password,
  setPassword,
  loginVisible,
  setLoginVisible,
  login,
}) => (
  <div className={cx(styles.Home)}>
    <Logo
      className={styles.Logo}
    />
    <Button
      onClick={goToUserSelection}
      className={styles.LoginButton}
      hidden={!loadingDone}
      small
      icon="logout"
    />
    <CallSupportButton
      className={styles.CallButton}
      hidden={!loadingDone}
      callSupport={callSupport} />

    <TextButton
      label="HomeStart"
      className={styles.StartButton}
      hidden={!loadingDone}
      onClick={goToProductSelection}
    />

    <LoginDialog
      visible={loginVisible}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onCancel={() => setLoginVisible(false)}
      onConfirm={login}
    />

    <div className={cx(styles.Loading, loadingDone && styles.isHidden)}>
      <Spinner/>
    </div>
    <div className={styles.Copyright}>{translate('HomeCopyright')}</div>
  </div>
);
