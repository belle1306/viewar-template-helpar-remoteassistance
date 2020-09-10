import React from 'react';
import cx from 'classnames';
import styles from './draw-canvas.scss';
import global from '../../../css/global.scss';

import { Button } from '../';

const MaterialButton = ({ setMaterial, material, active }) => (
  <div
    className={cx(styles.MaterialButton, global.ButtonColor, active && styles.isActive)}
    style={{ background: material.color }}
    onClick={() => setMaterial(material)}
  />
);

const SizeButton = ({ label, widthValue, setWidth, width }) => (
  <div
    className={cx(
      styles.Button,
      global.ButtonColor,
      width === widthValue && styles.isActive
    )}
    onClick={() => setWidth(widthValue)}
  >
    {label}
  </div>
);

export default ({
  disabled,
  material,
  updateMaterial,
  materials,
  updateWidth,
  width,
  addRef,
  canvasId,
  handleConfirm,
  handleCancel,
  admin,
}) => (
  <div className={cx(styles.Container, disabled && styles.isDisabled)}>
    <div className={styles.Buttons}>
      <div className={styles.Materials}>
        {materials.map((m) => (
          <MaterialButton
            key={m.id}
            material={m}
            active={m.id === material.id}
            setMaterial={updateMaterial}
          />
        ))}
      </div>

      <div className={styles.Confirmation}>
        {admin && (
          <Button
            className={styles.Button}
            medium
            icon="confirm"
            onClick={handleConfirm}
          />
        )}
        {admin && (
          <Button className={styles.Button} medium icon="cancel" onClick={handleCancel} />
        )}
      </div>

      {/* <div className={cx(styles.Button, styles.DeleteButton)} onClick={clear} />
      <SizeButton setWidth={updateWidth} width={width} widthValue={2} label="-"/>
      <SizeButton setWidth={updateWidth} width={width} widthValue={6} label="~"/>
      <SizeButton setWidth={updateWidth} width={width} widthValue={12} label="+"/> */}
    </div>

    <canvas
      className={cx(styles.Canvas, 'touchable')}
      id={canvasId}
      ref={addRef('canvas')}
    />
  </div>
);
