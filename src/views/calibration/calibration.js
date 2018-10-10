import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  withProps,
  withHandlers,
} from 'recompose';
import withRouteParams from '../../services/route-params';

import NoCalibration from './tracker/no-calibration';
import GroundConfirmCalibration from './tracker/ground-confirm-calibration';
import FloorOffsetCalibration from './tracker/floor-offset-calibration';
import TrackingMapCalibration from './tracker/tracking-map-calibration';

import viewarApi from 'viewar-api';

import {
  getTracker,
  usesTrackingMap,
  usesFloorOffsetModel,
  usesSimpleGroundConfirm,
} from './tracking-utils';

export default compose(
  withProps({
    getTracker,
    usesTrackingMap,
    usesFloorOffsetModel,
    usesSimpleGroundConfirm,
  }),
  withRouteParams(),
  withHandlers({
    goToNext: ({ goTo, nextView, annotationId, backPath, backArgs, topic }) => () => {
      goTo(nextView, {
        topic,
        annotationId,
        backPath,
        backArgs,
      });
    },
  }),
  branch(
    ({ getTracker, usesTrackingMap }) => usesTrackingMap(getTracker(viewarApi)),
    renderComponent(({ getTracker, ...props }) => (
      <TrackingMapCalibration tracker={getTracker(viewarApi)} {...props} />
    ))
  ),
  branch(
    ({ getTracker, usesFloorOffsetModel }) =>
      usesFloorOffsetModel(getTracker(viewarApi)),
    renderComponent(({ getTracker, ...props }) => (
      <FloorOffsetCalibration tracker={getTracker(viewarApi)} {...props} />
    ))
  ),
  branch(
    ({ getTracker, usesSimpleGroundConfirm }) =>
      usesSimpleGroundConfirm(getTracker(viewarApi)),
    renderComponent(({ getTracker, ...props }) => (
      <GroundConfirmCalibration tracker={getTracker(viewarApi)} {...props} />
    ))
  )
)(({ getTracker, ...props }) => (
  <NoCalibration tracker={getTracker(viewarApi)} {...props} />
));
