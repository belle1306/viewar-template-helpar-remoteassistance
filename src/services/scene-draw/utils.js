import viewarApi from 'viewar-api';

/**
 * Take canvas coordinates in pixels with reference point 0/0 in top left corner and convert to screen coordinates
 * between 0 and 1.
 */
export const convertCanvasToScreenCoordinates = (canvasX, canvasY) => {
  if (canvasX === undefined || canvasY === undefined) {
    return {
      x: undefined,
      y: undefined,
    };
  }

  const x = canvasX / document.body.clientWidth;
  const y = canvasY / document.body.clientHeight;

  // console.log(`[Utils] convert ${canvasX}/${canvasY} to ${x}/${y}`)

  return {
    x,
    y,
  };
};

export const assign = (target, ...sources) => {
  sources.forEach((source) =>
    Object.keys(source || {}).forEach((key) =>
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
    )
  );
  return target;
};
