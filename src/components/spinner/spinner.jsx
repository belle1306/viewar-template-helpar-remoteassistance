import React from 'react'
import cx from 'classnames'

import { translate } from '../../services'

import styles from './spinner.css'
import globalStyles from '../../../css/global.css'

import { Circle } from 'rc-progress'

export default ({loading, withProgress, progress}) =>
  <div className={cx(styles.spinnerWrapper, globalStyles.OverlayBackgroundColor, loading && styles.visible)}>
    {loading && !withProgress && [
      <div key="spinner" className={styles.loadingSpinner}>
        <div className={styles.doubleBounce1}/>
        <div className={styles.doubleBounce2}/>
      </div>,
      <div key="text" className={styles.loadingText}>{translate('SpinnerText')}</div>
    ]}
    {loading && withProgress && <div className={cx(styles.ProgressSpinner)}>
      <div className={cx(styles.Loading, globalStyles.ColorBright)}>{translate('SpinnerProgressText')}</div>
      <Circle key="circle" className={styles.Spinner} percent={progress} strokeWidth="8" strokeColor="white"
              trailWidth="4" trailColor="rgba(255,255,255,0.15)" gapPosition="bottom"/>
    </div>}
  </div>
