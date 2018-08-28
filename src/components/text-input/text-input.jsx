import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './text-input.css'
import globalStyles from '../../../css/global.css'

export default ({className, handleSubmit, value, placeholder, setValue, deleteButton}) =>
  <div className={cx(styles.TextInput, deleteButton && styles.withDelete, className)}>
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={({target}) => setValue(target.value)} value={value} placeholder={placeholder ? translate(placeholder, false) : ''} />
      {deleteButton && <div className={styles.DeleteButton} onClick={() => setValue('')}>x</div>}
    </form>
  </div>
