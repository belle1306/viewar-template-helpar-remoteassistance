import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './annotation-picker.css';
import globalStyles from '../../../css/global.css';

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
  noButtons,
}) => (
  <Fragment>
    <div className={cx(styles.TouchOverlay, !visible && styles.isHidden)} onClick={touch} />
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
      {!noButtons && <div className={styles.Buttons}>
        <Button className={styles.Button} medium icon="confirm" onClick={confirm} />
        <Button className={styles.Button} medium icon="cancel" onClick={cancel} />
      </div>}
    </div>
  </Fragment>
);
