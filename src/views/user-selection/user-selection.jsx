import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './user-selection.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'

const WaitForUserOverlay = ({visible}) => <div className={cx(styles.WaitForUserOverlay, !visible && styles.isHidden)}>
  {translate('UserSelectionWaitForUser')}
</div>

export default ({ clients, call, waitingForUser }) =>
  <div className={cx(styles.UserSelection, global.BackgroundImage)}>
    <HeaderBar goBack />
    <WaitForUserOverlay visible={waitingForUser} />
    <div className={styles.ClientList}>
      {clients.map(client => <div className={cx(styles.Client, global.ButtonColor)} key={client.id} onClick={() => call(client)}>
        <div className={styles.ClientName}>{client.id}</div>
      </div>)}
      {clients.length === 0 && <div className={styles.EmptyClientList}>{translate('UserSelectionEmptyList')}</div>}
    </div>
  </div>
