import React from 'react';
import cx from 'classnames';

import styles from './user-selection.scss';
import global from '../../../css/global.scss';

import { translate } from '../../services';
import { Button, AdminHeaderBar } from '../../components';

const WaitForUserOverlay = ({ visible }) => (
  <div className={cx(styles.WaitForUserOverlay, !visible && styles.isHidden)}>
    {translate('UserSelectionWaitForUser')}
  </div>
);

export default ({
  clients,
  call,
  waitingForUser,
  trimTopic,
  formatTime,
  userName,
}) => (
  <div className={cx(styles.UserSelection, global.BackgroundImage)}>
    <AdminHeaderBar userName={userName} />
    <WaitForUserOverlay visible={waitingForUser} />
    <div className={styles.Clients}>
      {clients.length === 0 && (
        <div className={styles.EmptyClientList}>
          {translate('UserSelectionEmptyList')}
        </div>
      )}
      {clients.map(client => (
        <div className={cx(styles.Client)} key={client.id}>
          <div className={styles.Info}>
            <div className={styles.Time}>
              {formatTime(client.data.timestamp)}
            </div>
            <div className={styles.Topic}>{trimTopic(client.data.topic)}</div>
          </div>
          <div className={styles.Call}>
            <Button
              medium
              green
              icon="call"
              onClick={() => call(client.id)}
              className={styles.CallButton}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
