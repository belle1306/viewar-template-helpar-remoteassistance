import React from 'react'
import cx from 'classnames'

import styles from './user-selection.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'

export default ({ clients, call }) =>
  <div className={cx(styles.UserSelection, global.BackgroundImage)}>
    <HeaderBar goBack />
    <div className={styles.ClientList}>
      {clients.map(client => <div className={cx(styles.Client, global.ButtonColor)} key={client.id} onClick={() => call(client)}>
        <div className={styles.ClientName}>{client.id}</div>
      </div>)}
    </div>
  </div>
