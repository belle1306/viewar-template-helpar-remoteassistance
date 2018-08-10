import React from 'react'
import cx from 'classnames'

import { translate } from '../../../services'

import Button from '../../../components/button/button'
import Toolbar from '../../../components/toolbar/toolbar'
import Hint from '../../../components/hint/hint'
import HeaderBar from '../../../components/header-bar/header-bar'

import styles from '../calibration.css'

export default ({confirmGround, scaleUp, scaleDown, tracking, goBack}) =>
  <div className={styles.Container}>
    <HeaderBar goBack={goBack}/>
    <Hint className={cx(tracking && styles.Hint)}>
      {!tracking ? translate('CalibrationFilmFloor') : translate('CalibrationScaleGround')}
    </Hint>
    <Toolbar position="left">
      <Button hidden={!tracking} icon={'confirmGround'} onClick={confirmGround}/>
    </Toolbar>
    <Toolbar position="right">
      <Button hidden={!tracking} icon={'scaleGroundDown'} className={styles.Button} onClick={scaleDown}/>
      <Button hidden={!tracking} icon={'scaleGroundUp'} className={styles.Button} onClick={scaleUp}/>
    </Toolbar>
  </div>
