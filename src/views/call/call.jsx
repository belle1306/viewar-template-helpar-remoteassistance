import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './call.css';
import global from '../../../css/global.css';

import Hint from '../../components/hint/hint';
import Button from '../../components/button/button';
import AnnotationPicker from '../../components/annotation-picker/annotation-picker';

const WaitForSupportAgentOverlay = ({ visible }) => (
  <div
    className={cx(
      styles.WaitForSupportAgentOverlay,
      !visible && styles.isHidden
    )}
  >
    <div className={styles.WaitMessage}>
      {translate('CallWaitForSupportAgent')}
    </div>
    <div className={styles.WaitAnimation}></div>
  </div>
);

export default ({
  admin,
  waitingForSupportAgent,
  showAnnotationPicker,
  closeAnnotationPicker,
  setShowAnnotationPicker,
  goBack,
  onTouch,
  toggleFreeze,
  frozen,
}) => (
  <div className={cx(styles.Call)}>
    <Button
      medium
      red
      icon="endcall"
      onClick={goBack}
      className={styles.EndCallButton}
      hidden={showAnnotationPicker}
    />

    {admin ? (
      <Fragment>
        <AnnotationPicker
          visible={showAnnotationPicker}
          onClose={closeAnnotationPicker}
        />
        <Button
          medium
          onClick={() => setShowAnnotationPicker(true)}
          icon="add"
          hidden={showAnnotationPicker}
          className={styles.AnnotationButton}
        />
        <Button
          medium
          icon="play"
          onClick={toggleFreeze}
          className={styles.FreezeButton}
          hidden={!frozen || showAnnotationPicker}
        />
        <Button
          medium
          icon="pause"
          onClick={toggleFreeze}
          className={styles.FreezeButton}
          hidden={frozen || showAnnotationPicker}
        />
      </Fragment>
    ) : (
      <Fragment>
        <WaitForSupportAgentOverlay visible={waitingForSupportAgent} />
        <div className={styles.TouchOverlay} onClick={onTouch} />
        {!waitingForSupportAgent && <Hint className={cx(styles.Hint)}>{translate('CallAnnotateHint')}</Hint>}
      </Fragment>
    )}
  </div>
);
