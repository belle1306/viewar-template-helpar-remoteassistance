import React from 'react'
import cx from 'classnames'

import styles from './toolbar.css'
import globalStyles from '../../../css/global.css'

export default ({hidden, className, children, position}) =>
  <div
    className={cx(styles.Container, 'coui-noinput', className, position && styles[`position-${position}`], hidden && styles.hidden)}>
    {children}
  </div>
