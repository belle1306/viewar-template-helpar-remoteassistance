import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './rating-overlay.scss';
import global from '../../../css/global.scss';

import { ButtonWithText, RatingStars } from '../';

export default ({ className, visible, onRate, onClose }) => (
  <div
    className={cx(styles.RatingOverlay, !visible && styles.isHidden, className)}
  >
    <div className={styles.RatingContent}>
      <div className={styles.Message}>{translate('RatingOverlayMessage')}</div>
      <RatingStars className={styles.Stars} updateRating={onRate} />

      <div className={styles.Buttons}>
        <ButtonWithText
          medium
          icon="back"
          label="RatingOverlayBack"
          onClick={() => onClose(true)}
        />
        <ButtonWithText
          medium
          icon="call"
          label="RatingOverlayCall"
          onClick={() => onClose(false)}
        />
      </div>
    </div>
  </div>
);
