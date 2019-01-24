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

/**
 * Parse material options to an array of {name, imageUrl} out of model description (not parsed via viewar-api, directly downloaded).
 */
export const parseMaterialOptions = description => {
  const options = [];
  const resource = description.materials[0].resource_pack;

  for (let i = 0; i < description.materials[0].options.length; i++) {
    const thumb = description.materials[0].options[i].thumb;
    const imageUrl = `/Models/Resources/${resource}/${thumb}`;

    options.push({
      name: description.materials[0].materials[0].options[i],
      imageUrl: viewarApi.coreInterface.resolveUrl(imageUrl),
    });
  }

  return options;
};
