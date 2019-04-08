import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './call.css';
import global from '../../../css/global.css';

import Hint from '../../components/hint/hint';
import Button from '../../components/button/button';
import AnnotationPicker from '../../components/annotation-picker/annotation-picker';
import DrawCanvas from '../../components/draw-canvas/draw-canvas';

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
          <DrawCanvas disabled={!showAnnotationPicker || annotationMode !== 'draw'} onCancel={closeAnnotationPicker} onConfirm={closeAnnotationPicker} admin drawOnMesh={meshScan} onSync={syncDrawing} />
        )}

        <AnnotationPicker
          visible={showAnnotationPicker && annotationMode === 'model'}
          onClose={closeAnnotationPicker}
        />

        <div className={cx(styles.FreezeFrames, frozen && styles.isHidden)}>
          {freezeFrames.map(freezeFrame => (
            <div key={freezeFrame.name} className={styles.FreezeFrame} onClick={() => loadFreezeFrame(freezeFrame)} >
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
        
        {useDrawing && <Button
          medium
          onClick={() => openAnnotationPicker('draw')}
          icon="draw"
          hidden={showAnnotationPicker}
          className={styles.AnnotationDrawButton}
        />}

        <Button
          medium
          icon='cast'
          onClick={sendFreezeFrame}
          className={styles.SendFreezeFrameButton}
          hidden={!freezeFrame || freezeFrameSent || showAnnotationPicker}
        />
        <Button
          medium
          icon='freezeframe'
          onClick={saveFreezeFrame}
          className={styles.FreezeFrameButton}
          hidden={perspective || frozen || showAnnotationPicker}
        />
        <Button
          medium
          icon='perspective'
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

        <Hint className={cx(styles.AdminHint)} hidden={!showAnnotationPicker}>{translate(annotationMode === 'draw' ? 'CallDrawHint' : 'CallTouchHint')}</Hint>
      </Fragment>
    ) : (
      <Fragment>
        {useDrawing && (
          <DrawCanvas disabled={annotationMode !== 'draw'} drawOnMesh={meshScan} onSync={syncDrawing} />
        )}

        <WaitForSupportAgentOverlay visible={waitingForSupportAgent} />
        {annotationMode === 'model' && <div className={styles.TouchOverlay} onClick={onTouch} />}
        
        {useDrawing && (
          <Fragment>
            <Button
              medium
              onClick={() => openAnnotationPicker('model')}
              icon="add"
              active={annotationMode === 'model'}
              className={styles.AnnotationButton}
            />

            <Button
              medium
              onClick={() => openAnnotationPicker('draw')}
              icon="draw"
              active={annotationMode === 'draw'}
              className={styles.AnnotationDrawButton}
            />
          </Fragment>
        )}

        {!waitingForSupportAgent && <Hint className={cx(styles.Hint)}>{translate(annotationMode === 'draw' ? 'CallDrawHint' : 'CallAnnotateHint')}</Hint>}
      </Fragment>
    )}
  </div>
);
