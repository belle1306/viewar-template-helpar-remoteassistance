import React from 'react'
import { withRouter } from 'react-router'
import { compose, pure, lifecycle, withState, withProps } from 'recompose'
import { withSetLoading } from '../../../services/loading'

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
  lifecycle({
    async componentWillMount() {
      const { nextView, history, setLoading, initTracking, activateARCamera, tracker } = this.props

      setLoading(true)
      await activateARCamera(viewarApi)
      await initTracking(tracker)
      setLoading(false)

      history.push({pathname: nextView, state: {backButtonPath: '/'}})
    }
  }),
  pure,
)(() => <div></div>)
