import pubSub from './pub-sub'

import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle
} from 'recompose'

export const load = ({setLoading, setProgress, setWithProgress}) => ({loading, progress = 0, withProgress = false}) => {
  setLoading(loading)
  setProgress(progress)
  setWithProgress(withProgress)
}

export const withLoading = (prefix = '') =>
  compose(
    withState('loading', 'setLoading', false),
    withState('progress', 'setProgress', 0),
    withState('withProgress', 'setWithProgress', false),
    withHandlers({
      load
    }),
    lifecycle({
      async componentDidMount () {
        pubSub.subscribe(prefix + 'loadingState', this.props.load)
      }
    })
  )

const setLoading = ({pubSub}) => (value, withProgress = false, progress = 0, prefix = '') => pubSub.publish(prefix + 'loadingState', {
  loading: value,
  progress,
  withProgress
})

export const withSetLoading = compose(
  withProps({pubSub}),
  withHandlers({
    setLoading,
  })
)

//======================================================================================================================

export const show = ({setVisible, visible, setTimeout, setContent, setShowIcon}) => ({content, closeAfter = 3000, showIcon = true}) => {
  setContent(content)
  setVisible(true)
  setShowIcon(showIcon)
  setTimeout(() => setVisible(false), closeAfter)
}

export const withToast = (prefix = '') =>
  compose(
    withState('content', 'setContent', ''),
    withState('showIcon', 'setShowIcon', true),
    withState('visible', 'setVisible', false),
    withProps({
      setTimeout
    }),
    withHandlers({
      show,
    }),
    lifecycle({
      async componentDidMount () {
        pubSub.subscribe(prefix + 'toast', this.props.show)
      }
    })
  )

const setToast = ({pubSub}) => (content, duration, showIcon, prefix = '') =>
  pubSub.publish(prefix + 'toast', {content, closeAfter: duration, showIcon})

export const withSetToast = compose(
  withProps({pubSub}),
  withHandlers({
    setToast
  })
)
