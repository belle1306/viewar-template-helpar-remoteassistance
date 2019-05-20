import React from 'react';
import cx from 'classnames';

import { translate } from '../../../services';
import { Button, Toolbar, Hint, HeaderBar } from '../../../components';

import styles from '../calibration.scss';

export default ({ confirmGround, scaleUp, scaleDown, tracking }) => (
  <div className={styles.Container}>
    <HeaderBar goBack />
    <Hint className={cx(tracking && styles.Hint)}>
      {!tracking
        ? translate('CalibrationFilmFloor')
        : translate('CalibrationScaleGround')}
    </Hint>
    <Toolbar position="left">
      <Button
        hidden={!tracking}
        icon={'confirmGround'}
        onClick={confirmGround}
      />
    </Toolbar>
    <Toolbar position="right">
      <Button
        hidden={!tracking}
        icon={'scaleGroundDown'}
        className={styles.Button}
        onClick={scaleDown}
      />
      <Button
        hidden={!tracking}
        icon={'scaleGroundUp'}
        className={styles.Button}
        onClick={scaleUp}
      />
    </Toolbar>
  </div>
);
