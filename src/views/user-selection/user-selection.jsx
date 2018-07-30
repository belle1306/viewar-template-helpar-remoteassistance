import React from 'react'
import cx from 'classnames'

import styles from './user-selection.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'

export default ({ clientIds, call }) =>
  <div className={cx(styles.UserSelection, global.BackgroundImage)}>
    <HeaderBar goBack />
    <div className={styles.ClientList}>
      {clientIds.map(clientId => <div className={cx(styles.Client, global.ButtonColor)} key={clientId} onClick={() => call(clientId)}>
        <div className={styles.ClientName}>{clientId}</div>
      </div>)}
    </div>
  </div>
