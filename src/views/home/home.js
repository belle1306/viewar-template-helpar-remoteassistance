import { compose, withHandlers, lifecycle, withProps, withState } from 'recompose'

import viewarApi from 'viewar-api'
import { getUiConfigPath } from '../../utils'
import { withDialogControls } from '../../services/dialog'
import { withSetLoading } from '../../services/loading'
import withRouteParams from '../../services/route-params'
import withCallClient from '../../services/call-client'
import authManager from '../../services/auth-manager'
import highlightManager from '../../services/highlight-manager'

import Home from './home.jsx'

export const init = ({viewarApi: { coreInterface, cameras }, disconnect, setLoadingDone, highlightManager, resetTrackers, authManager, updateProgress}) => async () => {
  setLoadingDone(false)

  disconnect()

  await cameras.perspectiveCamera.activate()
  await resetTrackers()
  await authManager.readPersisted()

  await highlightManager.init(updateProgress)
  setLoadingDone(true)
}

export const resetTrackers = ({viewarApi}) => async () => {
  for (let tracker of Object.values(viewarApi.trackers)) {
    await tracker.deactivate()
  }
}

export const goToProductSelection = ({goTo}) => async() => {
  goTo('/product-selection', {
    input: 'auto'
  })
}

export const goToUserSelection = ({goTo, setLoading, authManager, showDialog}) => async() => {
  if (authManager.user) {
    goTo('/user-selection')
  } else {
    const {confirmed, input} = await showDialog('HomeLoginText', {
      input: authManager.token || '',
      withInput: true,
      inputPlaceholder: 'HomeUsername',
      showCancel: true,
      confirmText: 'HomeLogin',
    })

    if (confirmed && input) {
      setLoading(true)
      const success = await authManager.login(input)
      setLoading(false)

      success && goTo('/user-selection')
    }
  }
}

export const updateProgress = ({ setProgress, setStatus }) => (count) => {
  const progress = ((count.current + count.currentProgress / 100) / count.total) * 100
  setProgress(progress)
}

export default compose(
  withCallClient,
  withRouteParams(),
  withDialogControls,
  withSetLoading,
  withState('loadingDone', 'setLoadingDone', false),
  withState('progress', 'setProgress', 0),
  withProps({
    viewarApi,
    getUiConfigPath,
    authManager,
    highlightManager,
  }),
  withHandlers({
    resetTrackers,
    updateProgress,
  }),
  withHandlers({
    init,
    goToUserSelection,
    goToProductSelection,
  }),
  lifecycle({
    componentDidMount () {
      this.props.init()
    }
  }),
)(Home)
