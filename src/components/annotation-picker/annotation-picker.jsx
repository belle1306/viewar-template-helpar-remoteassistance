import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './annotation-picker.css';
import globalStyles from '../../../css/global.css';

import Hint from '../hint/hint';
import Button from '../button/button';

export default ({
  models,
  visible,
  confirm,
  cancel,
  className,
  touch,
  selected,
  setSelected,
}) => (
  <Fragment>
    <div className={styles.TouchOverlay} onClick={touch} />
    <div className={cx(styles.AnnotationPicker, !visible && styles.isHidden)}>
      <div className={styles.Annotations}>
        {models.map(model => (
          <div
            key={model.id}
            className={cx(
              styles.Annotation,
              selected === model.id && styles.isSelected
            )}
          >
            <Button
              medium
              className={styles.AnnotationButton}
              icon={`annotation_${model.foreignKey}`}
              onClick={() => setSelected(model.id)}
            />
          </div>
        ))}
      </div>
      <div className={styles.Buttons}>
        <Button className={styles.Button} medium icon="confirm" onClick={confirm} />
        <Button className={styles.Button} medium icon="cancel" onClick={cancel} />
      </div>
      <Hint hidden={!selected} >
        {translate('AnnotationPickerHint')}
      </Hint>
    </div>
  </Fragment>
);
