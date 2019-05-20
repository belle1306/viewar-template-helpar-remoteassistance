import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import { TextButton, TextInput } from '../';

import styles from './login-dialog.scss';
import global from '../../../css/global.scss';

export default ({
  visible,
  onConfirm,
  onCancel,
  username,
  setUsername,
  password,
  setPassword,
}) => (
  <div className={cx(styles.DialogWrapper, visible && styles.visible)}>
    <div className={cx(styles.Dialog)}>
      <div className={cx(styles.Content)}>
        <div className={cx(styles.Message)}>{translate('LoginMessage')}</div>
        <TextInput
          value={username}
          setValue={setUsername}
          className={styles.Input}
          placeholder="LoginUsernamePlaceholder"
        />
        <TextInput
          value={password}
          setValue={setPassword}
          className={styles.Input}
          password
          placeholder="LoginPasswordPlaceholder"
        />
      </div>
      <div className={cx(styles.Buttons)}>
        <TextButton
          className={styles.Button}
          onClick={onConfirm}
          label="LoginConfirm"
        />
        <TextButton
          className={styles.Button}
          onClick={onCancel}
          label="DialogCancel"
        />
      </div>
    </div>
  </div>
);
