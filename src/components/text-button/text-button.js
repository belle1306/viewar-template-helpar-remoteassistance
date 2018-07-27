import React from 'react'
import cx from 'classnames'

import { translate } from '../../services'

import styles from './text-button.css'
import globalStyles from '../../../css/global.css'

export default ({label, hidden, className, onClick}) =>
  <div className={cx(styles.TextButton, hidden && styles.isHidden, className)} onClick={() => onClick && onClick()}>
    {translate(label)}
  </div>
