import React from 'react';

import styles from './toast.css';

export default ({ content, visible, showIcon }) => (
  <div className={styles.ToastWrapper}>
    {visible && (
      <div className={styles.Toast}>
        {showIcon && <div className={styles.Icon} />}
        <div className={styles.Message}>{content}</div>
      </div>
    )}
  </div>
);
