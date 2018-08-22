import React from 'react'
import cx from 'classnames'

import styles from './text-input.css'
import globalStyles from '../../../css/global.css'

export default ({className, value, setValue, deleteButton}) =>
  <div className={cx(styles.TextInput, className)}>
    <input type="text" onChange={({target}) => setValue(target.value)} value={value} />
    {deleteButton && <div className={styles.DeleteButton} onClick={() => setValue('')}>x</div>}
  </div>
