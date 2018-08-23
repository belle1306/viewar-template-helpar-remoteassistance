import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './call.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'
import Button from '../../components/button/button'

const WaitForSupportAgentOverlay = ({visible}) => <div className={cx(styles.WaitForSupportAgentOverlay, !visible && styles.isHidden)}>
  {translate('CallWaitForSupportAgent')}
</div>

export default ({ waitingForSupportAgent, highlight, goBack, onTouch }) =>
  <div className={cx(styles.Call)}>
    <HeaderBar goBack={goBack} />
    <WaitForSupportAgentOverlay visible={waitingForSupportAgent} />
    {/*<Button medium onClick={highlight} icon="" className={styles.HighlightButton} />*/}
    <div className={styles.TouchPlane} onClick={(e) => onTouch(e)} />
  </div>
