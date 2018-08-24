import React, { Fragment } from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './annotation.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'
import Button from '../../components/button/button'
import RatingOverlay from '../../components/rating-overlay/rating-overlay'

export default ({ annotation, descriptionVisible, rateOverlayVisible, showRateOverlay, closeRateOverlay, rateAnnotation }) =>
  <div className={cx(styles.Annotation)}>
    <HeaderBar goBack={showRateOverlay} />
    <RatingOverlay visible={rateOverlayVisible} onClose={closeRateOverlay} onRate={rateAnnotation}/>
    {!!annotation &&
      <Fragment>
        <div className={cx(styles.Description, (!descriptionVisible || rateOverlayVisible) && styles.isHidden)}>
          {annotation.description}
        </div>
        <div className={cx(styles.Hint, (descriptionVisible || rateOverlayVisible) && styles.isHidden)}>{translate('AnnotationHint')}</div>
      </Fragment>
    }
  </div>
