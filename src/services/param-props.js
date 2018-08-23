import { withRouter } from 'react-router'
import { compose, withProps, withHandlers } from 'recompose'

export const withParamProps = (props = {}) => compose(
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

      props[args] = args

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
)

export const withGoTo = compose(
  withRouter,
  withHandlers({
    goToWithArgs: ({history}) => (path, args = {}) => {
      const savePath = path.endsWith('/') ? path : path + '/'
      const saveArgs = encodeURIComponent(JSON.stringify(args))

      history.push(savePath + saveArgs)
    },
  }),
  withHandlers({
    goToLast: ({goToWithArgs, history, backPath, backArgs}) => () => {
      if (backPath) {
        goToWithArgs(backPath, backArgs)
      } else {
        history.goBack()
      }
    }
  }),
)
