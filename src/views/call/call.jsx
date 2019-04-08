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
  setShowAnnotationPicker,
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

    <Button
      medium
      icon={microphoneMuted ? 'unmute' : 'mute'}
      onClick={toggleMuteMicrophone}
      className={styles.MuteMicrophoneButton}
      small
      hidden={showAnnotationPicker}
    />

    <Button
      medium
      icon={speakerMuted ? 'unmute_speaker' : 'mute_speaker'}
      onClick={toggleMuteSpeaker}
      className={styles.MuteSpeakerButton}
      small
      hidden={showAnnotationPicker}
    />

    {admin ? (
      <Fragment>
        {useDrawing ? (
          <DrawCanvas disabled={!showAnnotationPicker} onCancel={closeAnnotationPicker} onConfirm={closeAnnotationPicker} admin drawOnMesh={meshScan} onSync={syncDrawing} />
        ) : (
          <AnnotationPicker
            visible={showAnnotationPicker}
            onClose={closeAnnotationPicker}
          />
        )}

        <div className={cx(styles.FreezeFrames, frozen && styles.isHidden)}>
          {freezeFrames.map(freezeFrame => (
            <div key={freezeFrame.name} className={styles.FreezeFrame} onClick={() => loadFreezeFrame(freezeFrame)} >
              <img src={freezeFrame.thumbnailUrl} />
            </div>
          ))}
        </div>
        <Button
          medium
          onClick={() => setShowAnnotationPicker(true)}
          icon="add"
          hidden={showAnnotationPicker}
          className={styles.AnnotationButton}
        />
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
      </Fragment>
    ) : (
      <Fragment>
        {useDrawing && (
          <DrawCanvas drawOnMesh={meshScan} onSync={syncDrawing} />
        )}
        
        <WaitForSupportAgentOverlay visible={waitingForSupportAgent} />
        <div className={styles.TouchOverlay} onClick={onTouch} />

        {!waitingForSupportAgent && <Hint className={cx(styles.Hint)}>{translate(useDrawing ? 'CallDrawHint' : 'CallAnnotateHint')}</Hint>}
      </Fragment>
    )}
  </div>
);
