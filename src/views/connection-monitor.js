import { withRouter } from 'react-router'
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, lifecycle, getContext } from 'recompose'
import { withDialogControls } from '../services/dialog'

const render = ({children}) => <Fragment>{children}</Fragment>

export default compose(
  getContext({
    callClient: PropTypes.object
  }),
  withRouter,
  withDialogControls,
  lifecycle({
    componentDidMount() {
      const { callClient, history, showDialog, backPath } = this.props

      callClient.disconnect.subscribe(async() => {
        await showDialog('MessageConnectionLost', {
          confirmText: 'DialogOK'
        })
        history.push('/')
      })

      callClient.endedCall.subscribe(async() => {
        await showDialog('MessageCallEnded', {
          confirmText: 'DialogOK'
        })
        if (backPath) {
          history.push(backPath)
        } else {
          history.goBack()
        }
      })

    }
  })
)(render)
