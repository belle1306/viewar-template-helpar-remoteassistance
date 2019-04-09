import React from 'react';
import cx from 'classnames';

import { translate } from '../../../services';

import Hint from '../../../components/hint/hint';
import HeaderBar from '../../../components/header-bar/header-bar';

import styles from '../calibration.css';

import { CalibratonInstruction } from '../../../components/calibration-instruction';

export default ({ deviceType }) => (
  <div className={styles.Container}>
    <HeaderBar goBack />
    <div className={styles.AnimationWrapper}>
      <CalibratonInstruction deviceType={deviceType} />
    </div>
    <Hint>{translate('CalibrationFilmFloor')}</Hint>
  </div>
);
