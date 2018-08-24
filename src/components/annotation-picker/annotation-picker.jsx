import React from 'react'
import cx from 'classnames'
import { translate } from '../../services'

import styles from './annotation-picker.css'
import globalStyles from '../../../css/global.css'

import Button from '../button/button'

export default ({models, visible, confirm, cancel, className, touch, selected, setSelected}) =>
  <div className={cx(styles.AnnotationPicker, !visible && styles.isHidden)}>
    <div className={styles.Annotations}>
      {models.map(model =>
        <div key={model.id} className={cx(styles.Annotation, selected === model.id && styles.isSelected)}>
          <div className={styles.AnnotationImage} style={{backgroundImage: `url('${model.imageUrl}')`}} onClick={() => setSelected(model.id)}></div>
        </div>
      )}
    </div>
    <div className={styles.TouchOverlay} onClick={touch} />
    <div className={styles.Buttons}>
      <Button className={styles.Button} icon="confirm" onClick={confirm} />
      <Button className={styles.Button} icon="cancel" onClick={cancel}/>
    </div>
    <div className={cx(styles.Hint, !selected && styles.isHidden)}>{translate('AnnotationPickerHint')}</div>
  </div>
