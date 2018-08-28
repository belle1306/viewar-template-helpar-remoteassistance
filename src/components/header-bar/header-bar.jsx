import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'
import Button from '../../components/button/button'

import styles from './header-bar.css'
import global from '../../../css/global.css'

export default ({goBack, goHome, showHelp, title, goHomeFunction, goBackFunction, showHomeIconOnBack, dark, className,}) =>
  <div className={cx(styles.Container, className)}>
    <Button onClick={goBackFunction} icon={showHomeIconOnBack ? 'home' : 'back'} size={'small'} dark={dark}
            className={cx(!goBack && styles.isHidden, styles.Button)}/>
    <Button onClick={showHelp ? showHelp : () => {}} icon={'help'} size={'small'} dark={dark}
            className={cx(!showHelp && styles.isHidden, styles.Button, styles.ButtonShowHelp)}/>
    <Button onClick={goHomeFunction} icon={'home'} size={'small'} dark={dark}
            className={cx(!goHome && styles.isHidden, styles.Button, (!showHelp && !goBack) && styles.PositionLeft)}/>
    {title && <div className={cx(styles.Title, (!showHelp && !goBack && !goHome) && styles.PositionLeft)}>{translate(title)}</div>}
  </div>
