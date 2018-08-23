import React from 'react'
import { withRouter } from 'react-router'
import { compose, pure, lifecycle, withState, withProps } from 'recompose'
import { withSetLoading } from '../../../services/loading'
import { withGoTo, withParamProps } from '../../../services/param-props'

import viewarApi from 'viewar-api'

import { initTracking, activateARCamera } from '../tracking-utils'

export default compose(
  withRouter,
  withSetLoading,
  withState('loadingVisible', 'setLoadingVisible', true),
  withProps({
    initTracking,
    activateARCamera,
  }),
  withGoTo,
  withParamProps(),
  lifecycle({
    async componentWillMount() {
      const { setLoading, initTracking, activateARCamera, goToNext} = this.props

      setLoading(true)
      await activateARCamera(viewarApi)
      await initTracking(tracker)
      setLoading(false)

      goToNext()
    }
  }),
  pure,
)(() => <div></div>)
