import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './annotation.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'
import Button from '../../components/button/button'

export default ({ waitingForSupportAgent, highlight, goBack, onTouch, backPath, backArgs }) =>
  <div className={cx(styles.Annotation)}>
    <HeaderBar goBack backPath={backPath} backArgs={backArgs}  />
  </div>
