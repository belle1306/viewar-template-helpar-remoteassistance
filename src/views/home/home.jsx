import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './home.css';
import global from '../../../css/global.css';

import Logo from '../../components/logo/logo';
import TextButton from '../../components/text-button/text-button';
import Spinner from '../../components/spinner/spinner.jsx';
import Background from '../../components/background/background.jsx';

export default ({
  goToProductSelection,
  goToUserSelection,
  loadingDone,
  progress,
}) => (
  <div className={cx(styles.Home)}>
    <Logo
      className={styles.Logo}
      onClick={goToUserSelection}
    />
    <TextButton
      label="HomeStart"
      className={styles.StartButton}
      hidden={!loadingDone}
      onClick={goToProductSelection}
    />

    <div className={cx(styles.Loading, loadingDone && styles.isHidden)}>
      <Spinner/>
    </div>
    <div className={styles.Copyright}>{translate('HomeCopyright')}</div>
  </div>
);
