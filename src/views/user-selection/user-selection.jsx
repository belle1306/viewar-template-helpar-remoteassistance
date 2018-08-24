import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './user-selection.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'
import TextButton from '../../components/text-button/text-button'

const WaitForUserOverlay = ({visible}) => <div className={cx(styles.WaitForUserOverlay, !visible && styles.isHidden)}>
  {translate('UserSelectionWaitForUser')}
</div>

export default ({ clients, selectedClient, setSelectedClient, call, waitingForUser }) =>
  <div className={cx(styles.UserSelection, global.BackgroundImage)}>
    <HeaderBar goBack />
    <WaitForUserOverlay visible={waitingForUser} />
    <div className={styles.Content}>
      {clients.length === 0 && <div className={styles.EmptyClientList}>{translate('UserSelectionEmptyList')}</div>}
      <div className={styles.ClientList}>
        {clients.map(client =>
        <div className={cx(styles.Client, selectedClient === client && styles.isSelected)} key={client.id} onClick={() => setSelectedClient(client)}>
          {client.id}
        </div>)}
      </div>
      <div className={styles.Buttons}>
        {clients.length !== 0 && <TextButton className={cx(styles.CallButton)} inactive={!selectedClient} label="UserSelectionAnswerCall" onClick={call}/>}
      </div>
    </div>
  </div>
