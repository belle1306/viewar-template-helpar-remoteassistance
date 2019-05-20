import React from 'react';
import cx from 'classnames';

import styles from './rating-stars.scss';
import global from '../../../css/global.scss';

export default ({ onRate, starCount, rating, className }) => (
  <div className={cx(styles.RatingStars, className)}>
    {[...Array(starCount)].map((x, i) => (
      <div
        className={cx(styles.Star, i < rating && styles.isChecked)}
        key={i}
        onClick={() => onRate(i + 1)}
      />
    ))}
  </div>
);
