import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  withProps,
  withHandlers,
} from 'recompose';
import { withRouteParams } from '../../services';

import NoCalibration from './tracker/no-calibration';
import GroundConfirmCalibration from './tracker/ground-confirm-calibration';
import FloorOffsetCalibration from './tracker/floor-offset-calibration';
import TrackingMapCalibration from './tracker/tracking-map-calibration';

import viewarApi from 'viewar-api';

import {
  usesTrackingMap,
  usesFloorOffsetModel,
  usesSimpleGroundConfirm,
} from './tracking-utils';

export default compose(
  withProps({
    usesTrackingMap,
    usesFloorOffsetModel,
    usesSimpleGroundConfirm,
  }),
  withRouteParams(),
  withHandlers({
    goToNext: ({
      goTo,
      nextView,
      annotationId,
      backPath,
      backArgs,
      topic,
    }) => () => {
      const meshScan = viewarApi.tracker && !!viewarApi.tracker.startMeshScan;
      goTo(nextView, {
        topic,
        annotationId,
        backPath,
        backArgs,
        meshScan,
      });
    },
  }),
  branch(
    ({ usesTrackingMap }) => usesTrackingMap(viewarApi.tracker),
    renderComponent(({ ...props }) => (
      <TrackingMapCalibration tracker={viewarApi.tracker} {...props} />
    ))
  ),
  branch(
    ({ usesFloorOffsetModel }) => usesFloorOffsetModel(viewarApi.tracker),
    renderComponent(({ ...props }) => (
      <FloorOffsetCalibration tracker={viewarApi.tracker} {...props} />
    ))
  ),
  branch(
    ({ usesSimpleGroundConfirm }) => usesSimpleGroundConfirm(viewarApi.tracker),
    renderComponent(({ ...props }) => (
      <GroundConfirmCalibration tracker={viewarApi.tracker} {...props} />
    ))
  )
)(({ ...props }) => <NoCalibration tracker={viewarApi.tracker} {...props} />);
