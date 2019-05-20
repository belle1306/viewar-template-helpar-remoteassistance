import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import { TextButton, TextInput } from '../';

import styles from './dialog.scss';
import global from '../../../css/global.scss';

export default ({
  message,
  visible,
  onConfirm,
  onCancel,
  showConfirm,
  showCancel,
  confirmText,
  cancelText,
  withInput,
  input,
  inputPlaceholder,
  inputPassword,
  setInput,
}) => (
  <div className={cx(styles.DialogWrapper, visible && styles.visible)}>
    <div className={cx(styles.Dialog)}>
      <div className={cx(styles.Content)}>
        <div className={cx(styles.Message)}>{translate(message)}</div>
        {withInput && (
          <TextInput
            value={input}
            setValue={setInput}
            className={styles.Input}
            password={inputPassword}
            placeholder={inputPlaceholder}
          />
        )}
      </div>
      <div className={cx(styles.Buttons)}>
        {showConfirm && (
          <TextButton
            className={styles.Button}
            onClick={onConfirm}
            label={confirmText}
          />
        )}
        {showCancel && (
          <TextButton
            className={styles.Button}
            onClick={onCancel}
            label={cancelText}
          />
        )}
      </div>
    </div>
  </div>
);
