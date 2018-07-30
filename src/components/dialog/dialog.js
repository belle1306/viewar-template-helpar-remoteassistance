import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import TextButton from '../text-button/text-button'

import styles from './dialog.css'
import global from '../../../css/global.css'

export default ({message, visible, onConfirm, onCancel, showConfirm, showCancel, confirmText, cancelText, withInput, input, setInput}) =>
  <div className={cx(styles.DialogWrapper, visible && styles.visible)}>
    <div className={cx(styles.Dialog)}>
      <div className={cx(styles.Content)}>
        <div className={cx(styles.Message)}>{translate(message)}</div>
        {withInput && <div className={styles.Input}>
          <input type="text" value={input} onChange={({target}) => setInput(target.value)}/>
        </div>}
      </div>
      <div className={cx(styles.Buttons)}>
        {showConfirm && <TextButton className={styles.Button} onClick={onConfirm} label={confirmText} />}
        {showCancel && <TextButton className={styles.Button} onClick={onCancel} label={cancelText} />}
      </div>
    </div>
  </div>
