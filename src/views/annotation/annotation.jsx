import React, { Fragment } from 'react';
import cx from 'classnames';

import styles from './annotation.scss';
import global from '../../../css/global.scss';

import { translate } from '../../services';
import { HeaderBar, Button, RatingOverlay, Hint } from '../../components';

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
