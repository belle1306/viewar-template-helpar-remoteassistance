import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './home.css';
import global from '../../../css/global.css';

import Logo from '../../components/logo/logo';
import Button from '../../components/button/button';
import TextButton from '../../components/text-button/text-button';
import LoadingBar from '../../components/loading-bar/loading-bar';

export default ({
  goToProductSelection,
  goToUserSelection,
  loadingDone,
  progress,
}) => (
  <div className={cx(styles.Home, global.BackgroundImage)}>
    <Logo className={styles.Logo} />
    <Button
      icon="login"
      className={styles.LoginButton}
      onClick={goToUserSelection}
      hidden={!loadingDone}
    />
    <TextButton
      label="HomeStart"
      className={styles.StartButton}
      hidden={!loadingDone}
      round
      large
      onClick={goToProductSelection}
    />
    <div className={cx(styles.LoadingText, loadingDone && styles.isHidden)}>
      {translate('HomeLoading')}
    </div>
    <LoadingBar visible={!loadingDone} progress={progress} />
  </div>
);
