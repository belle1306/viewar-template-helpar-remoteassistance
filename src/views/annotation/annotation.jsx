import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './annotation.css';
import global from '../../../css/global.css';

import HeaderBar from '../../components/header-bar/header-bar';
import Button from '../../components/button/button';
import RatingOverlay from '../../components/rating-overlay/rating-overlay';
import Hint from '../../components/hint/hint';

export default ({
  tracking,
  annotation,
  descriptionVisible,
  rateOverlayVisible,
  showRateOverlay,
  closeRateOverlay,
  rateAnnotation,
}) => (
  <div className={cx(styles.Annotation)}>
    <HeaderBar goBack={showRateOverlay} showCancelIconOnBack />
    <RatingOverlay
      visible={rateOverlayVisible}
      onClose={closeRateOverlay}
      onRate={rateAnnotation}
    />
    {!!annotation && (
      <Fragment>
        <div
          className={cx(
            styles.Description,
            (!descriptionVisible || rateOverlayVisible) && styles.isHidden
          )}
        >
          {annotation.description}
        </div>
        <Hint hidden={descriptionVisible || rateOverlayVisible}>
          {translate(tracking ? 'AnnotationHint' : 'AnnotationFilmLearnedArea')}
        </Hint>
      </Fragment>
    )}
  </div>
);
