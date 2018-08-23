import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './text-input.css'
import globalStyles from '../../../css/global.css'

export default ({className, value, setValue, deleteButton}) =>
  <div className={cx(styles.TextInput, deleteButton && styles.withDelete, className)}>
    <input type="text" onChange={({target}) => setValue(target.value)} value={value} placeholder={translate("SearchPlaceholder", false)} />
    {deleteButton && <div className={styles.DeleteButton} onClick={() => setValue('')}>x</div>}
  </div>
