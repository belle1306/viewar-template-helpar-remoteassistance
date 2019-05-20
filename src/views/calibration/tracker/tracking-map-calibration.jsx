import React from 'react';
import cx from 'classnames';

import { translate } from '../../../services';

import { Hint, HeaderBar, CalibrationInstruction } from '../../../components';

import styles from '../calibration.scss';

export default ({ deviceType }) => (
  <div className={styles.Container}>
    <HeaderBar goBack />
    <div className={styles.AnimationWrapper}>
      <CalibrationInstruction deviceType={deviceType} />
    </div>
    <Hint>{translate('CalibrationFilmFloor')}</Hint>
  </div>
);
