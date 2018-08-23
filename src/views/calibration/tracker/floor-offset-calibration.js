import { compose, pure,lifecycle, withState, withProps, withHandlers } from 'recompose'
import { withSetLoading } from '../../../services/loading'

import viewarApi from 'viewar-api'

import FloorOffsetCalibration from './floor-offset-calibration.jsx'

import { initTracking, activateARCamera, getDeviceType, insertFloorOffsetModel, removeFloorOffsetModel, scaleFloorOffsetModel } from '../tracking-utils.js'

export default compose(
  withSetLoading,
  withState('loadingVisible', 'setLoadingVisible', true),
  withState('deviceType', 'setDeviceType', null),
  withState('tracking', 'setTracking', false),
  withProps({
    getDeviceType,
    initTracking,
    activateARCamera,
    insertFloorOffsetModel,
    removeFloorOffsetModel,
    scaleFloorOffsetModel,
  }),
  withHandlers({
    onTrackingChanged: ({tracker, setTracking}) => () => setTracking(tracker.tracking),
    scaleUp: ({tracker, scaleFloorOffsetModel}) => (factor) => scaleFloorOffsetModel(tracker, 100),
    scaleDown: ({tracker, scaleFloorOffsetModel}) => (factor) => scaleFloorOffsetModel(tracker, -100),
  }),
  withHandlers({
    goBack: ({goToLast, tracker, onTrackingChanged, removeFloorOffsetModel}) => () => {
      tracker.off('trackingTargetStatusChanged', onTrackingChanged)
      removeFloorOffsetModel(viewarApi)
      goToLast()
    },
    confirmGround: ({setLoading, tracker, removeFloorOffsetModel, onTrackingChanged, goToNext}) => async() => {
      setLoading(true)

      tracker.off('trackingTargetStatusChanged', onTrackingChanged)
      await tracker.confirmGroundPosition()

      removeFloorOffsetModel(viewarApi)
      setLoading(false)

      goToNext()
    }
  }),
  lifecycle({
    async componentWillMount() {
      const { getDeviceType, setDeviceType, setLoading, initTracking, activateARCamera, tracker, onTrackingChanged, insertFloorOffsetModel } = this.props

      setDeviceType(getDeviceType(viewarApi))

      setLoading(true)
      await activateARCamera(viewarApi)
      await insertFloorOffsetModel(viewarApi)
      await initTracking(tracker)
      tracker.on('trackingTargetStatusChanged', onTrackingChanged)
      setLoading(false)
    }
  }),
  pure,
)(FloorOffsetCalibration)
