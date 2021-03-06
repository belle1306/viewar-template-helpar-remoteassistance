import React, { Fragment } from 'react';
import cx from 'classnames';

import styles from './call.scss';
import global from '../../../css/global.scss';

import { translate } from '../../services';
import { Hint, Button, AnnotationPicker, DrawCanvas } from '../../components';

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
    <div className={styles.WaitAnimation} />
  </div>
);

const CallTemplate = ({
  admin,
  waitingForSupportAgent,
  showAnnotationPicker,
  closeAnnotationPicker,
  openAnnotationPicker,
  goBack,
  onTouch,
  toggleFreeze,
  frozen,
  perspective,
  togglePerspective,
  unpause,
  meshScan,
  syncDrawing,
  freezeFrames,
  saveFreezeFrame,
  loadFreezeFrame,
  freezeFrame,
  sendFreezeFrame,
  freezeFrameSent,
  toggleMuteMicrophone,
  microphoneMuted,
  toggleMuteSpeaker,
  speakerMuted,
  useDrawing,
  annotationMode,
  toggleDraw,
}) => (
  <div className={cx(styles.Call)}>
    <Button
      medium
      red
      icon="endcall"
      onClick={goBack}
      className={styles.EndCallButton}
      hidden={admin && showAnnotationPicker}
    />

    <Button
      medium
      icon={microphoneMuted ? 'unmute' : 'mute'}
      onClick={toggleMuteMicrophone}
      className={styles.MuteMicrophoneButton}
      small
      hidden={admin && showAnnotationPicker}
    />

    <Button
      medium
      icon={speakerMuted ? 'unmute_speaker' : 'mute_speaker'}
      onClick={toggleMuteSpeaker}
      className={styles.MuteSpeakerButton}
      small
      hidden={admin && showAnnotationPicker}
    />

    {admin ? (
      <Fragment>
        {useDrawing && (
          <DrawCanvas
            disabled={!showAnnotationPicker || annotationMode !== 'draw'}
            onCancel={closeAnnotationPicker}
            onConfirm={closeAnnotationPicker}
            admin
            drawOnMesh={meshScan}
            onSync={syncDrawing}
          />
        )}

        <AnnotationPicker
          visible={showAnnotationPicker && annotationMode === 'model'}
          onClose={closeAnnotationPicker}
        />

        <div className={cx(styles.FreezeFrames, frozen && styles.isHidden)}>
          {freezeFrames.map(freezeFrame => (
            <div
              key={freezeFrame.name}
              className={styles.FreezeFrame}
              onClick={() => loadFreezeFrame(freezeFrame)}
            >
              <img src={freezeFrame.thumbnailUrl} />
            </div>
          ))}
        </div>

        <Button
          medium
          onClick={() => openAnnotationPicker('model')}
          icon="add"
          hidden={showAnnotationPicker}
          className={styles.AnnotationButton}
        />

        {useDrawing && (
          <Button
            medium
            onClick={() => openAnnotationPicker('draw')}
            icon="draw"
            hidden={showAnnotationPicker}
            className={styles.AnnotationDrawButton}
          />
        )}

        <Button
          medium
          icon="cast"
          onClick={sendFreezeFrame}
          className={styles.SendFreezeFrameButton}
          hidden={!freezeFrame || freezeFrameSent || showAnnotationPicker}
        />
        <Button
          medium
          icon="freezeframe"
          onClick={saveFreezeFrame}
          className={styles.FreezeFrameButton}
          hidden={perspective || frozen || showAnnotationPicker}
        />
        <Button
          medium
          icon="perspective"
          onClick={togglePerspective}
          className={styles.PerspectiveButton}
          hidden={showAnnotationPicker || perspective || frozen}
        />
        <Button
          medium
          icon="play"
          onClick={unpause}
          className={styles.UnpauseButton}
          hidden={(!frozen && !perspective) || showAnnotationPicker}
        />
        <Button
          medium
          icon="pause"
          onClick={toggleFreeze}
          className={styles.FreezeButton}
          hidden={frozen || showAnnotationPicker || perspective}
        />

        <Hint className={cx(styles.Hint)} hidden={!showAnnotationPicker}>
          {translate(
            annotationMode === 'draw' ? 'CallDrawHint' : 'CallTouchHint'
          )}
        </Hint>
      </Fragment>
    ) : (
      <Fragment>
        <WaitForSupportAgentOverlay visible={waitingForSupportAgent} />

        <AnnotationPicker
          visible={!showAnnotationPicker}
          onAnnotation={onTouch}
          noButtons
          user
        />

        {useDrawing && (
          <Fragment>
            <DrawCanvas
              disabled={!showAnnotationPicker}
              drawOnMesh={meshScan}
              onSync={syncDrawing}
            />

            <Button
              medium
              onClick={toggleDraw}
              icon={showAnnotationPicker ? 'cancel' : 'draw'}
              className={styles.AnnotationButton}
            />
          </Fragment>
        )}

        {!waitingForSupportAgent && (
          <Hint className={cx(styles.Hint)}>
            {translate(
              showAnnotationPicker ? 'CallDrawHint' : 'CallAnnotateHint'
            )}
          </Hint>
        )}
      </Fragment>
    )}
  </div>
);

export default CallTemplate;
