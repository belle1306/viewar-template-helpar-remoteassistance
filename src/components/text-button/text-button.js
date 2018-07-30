import React from 'react'
import cx from 'classnames'

import { translate } from '../../services'

import styles from './text-button.css'
import global from '../../../css/global.css'

export default ({label, round, large, hidden, className, onClick}) =>
  <div className={cx(styles.TextButton, global.ButtonColor,
    hidden && styles.isHidden, round && styles.isRound, large && styles.isLarge,
    className)} onClick={() => onClick && onClick()}>
    {translate(label)}
  </div>
