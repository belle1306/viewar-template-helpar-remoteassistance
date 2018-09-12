import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './call.css';
import global from '../../../css/global.css';

import HeaderBar from '../../components/header-bar/header-bar';
import Button from '../../components/button/button';

import AnnotationPicker from '../../components/annotation-picker/annotation-picker';

const WaitForSupportAgentOverlay = ({ visible }) => (
  <div
    className={cx(
      styles.WaitForSupportAgentOverlay,
      !visible && styles.isHidden
    )}
  >
    {translate('CallWaitForSupportAgent')}
  </div>
);

const EndCallButton = ({ visible, onClick }) => {};

export default ({
  admin,
  waitingForSupportAgent,
  showAnnotationPicker,
  closeAnnotationPicker,
  setShowAnnotationPicker,
  goBack,
  onTouch,
}) => (
  <div className={cx(styles.Call)}>
    <Button
      medium
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
      </Fragment>
    ) : (
      <Fragment>
        <WaitForSupportAgentOverlay visible={waitingForSupportAgent} />
        <div className={styles.TouchOverlay} onClick={onTouch} />
        <div className={cx(styles.Hint)}>{translate('CallAnnotateHint')}</div>
      </Fragment>
    )}
  </div>
);
