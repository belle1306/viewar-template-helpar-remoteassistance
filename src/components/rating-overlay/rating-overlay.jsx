import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './rating-overlay.css';
import globalStyles from '../../../css/global.css';

import ButtonWithText from '../button-with-text/button-with-text';
import RatingStars from '../rating-stars/rating-stars';

export default ({ className, visible, onRate, onClose }) => (
  <div
    className={cx(styles.RatingOverlay, !visible && styles.isHidden, className)}
  >
    <div className={styles.RatingContent}>
      <div className={styles.Message}>{translate('RatingOverlayMessage')}</div>
      <RatingStars className={styles.Stars} updateRating={onRate} />

      <div className={styles.Buttons}>
        <ButtonWithText
          icon="back"
          label="RatingOverlayBack"
          onClick={() => onClose(true)}
        />
        <ButtonWithText
          icon="call"
          label="RatingOverlayCall"
          onClick={() => onClose(false)}
        />
      </div>
    </div>
  </div>
);
