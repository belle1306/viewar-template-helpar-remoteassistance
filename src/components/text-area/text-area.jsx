import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './text-area.css';
import globalStyles from '../../../css/global.css';

export default ({ className, value, placeholder, setValue }) => (
  <div className={cx(styles.TextArea, className)}>
    <textarea
      onChange={({ target }) => setValue(target.value)}
      value={value}
      placeholder={placeholder ? translate(placeholder, false) : ''}
    />
  </div>
);
