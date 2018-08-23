import { withRouter } from 'react-router'
import { compose, withProps, withHandlers } from 'recompose'

export default(props = {}) => compose(
  withRouter,
  withProps(({ match: { params }}) => {
    const newProps = {}

    for(let prop of Object.keys(params)) {
      newProps[prop] = params[prop]
    }

    if (params.args) {
      let args = {}
      try {
        args = JSON.parse(decodeURIComponent(params.args))
      } catch(e) {
        console.error('Invalid route args', params.args)
      }

      newProps.args = args

      for(let prop of Object.keys(args)) {
        if (props[prop]) {
          newProps[prop] = props[prop](args[prop])
        } else {
          newProps[prop] = args[prop]
        }
      }
    }

    return newProps
  }),
  withHandlers({
    goTo: ({history}) => (path, args) => {
      const savePath = path.endsWith('/') ? path : path + '/'
      const saveArgs = encodeURIComponent(JSON.stringify(args || {}))

      history.push(savePath + saveArgs)
    },
  }),
  withHandlers({
    goToLastView: ({goTo, history, backPath, backArgs}) => () => {
      if (backPath) {
        goTo(backPath, backArgs)
      } else {
        history.goBack()
      }
    }
  }),
)

export const withGoTo = compose(
)
