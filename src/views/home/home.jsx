import React from 'react';
import cx from 'classnames';

import styles from './home.scss';
import global from '../../../css/global.scss';

import { translate } from '../../services';
import {
  Logo,
  TextButton,
  Spinner,
  Button,
  CallSupportButton,
  LoginDialog,
} from '../../components';

const HomeTemplate = ({
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
  knowledgeBase,
}) => (
  <div className={cx(styles.Home)}>
    <Logo className={styles.Logo} />
    <Button
      onClick={goToUserSelection}
      className={styles.LoginButton}
      hidden={!loadingDone}
      noBackground
      small
      icon="logout"
    />
    <CallSupportButton
      className={styles.CallButton}
      hidden={!loadingDone}
      callSupport={callSupport}
    />
    {!!knowledgeBase && (
      <TextButton
        label="HomeStart"
        className={styles.StartButton}
        hidden={!loadingDone}
        onClick={goToProductSelection}
      />
    )}
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
      <Spinner />
    </div>
    <div className={styles.Copyright}>{translate('HomeCopyright')}</div>
  </div>
);

export default HomeTemplate;
