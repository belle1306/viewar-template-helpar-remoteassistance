import { MemoryRouter, Route, Switch, withRouter } from 'react-router';
import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';

import Home from './views/home/home.js';
import Call from './views/call/call.js';
import ProductSelection from './views/product-selection/product-selection.js';
import UserSelection from './views/user-selection/user-selection.js';
import Calibration from './views/calibration/calibration.js';
import AnnotationSelection from './views/annotation-selection/annotation-selection.js';
import Annotation from './views/annotation/annotation.js';
import Review from './views/review/review.js';
import ConnectionMonitor from './views/connection-monitor';

import Spinner from './components/spinner/spinner.jsx';
import Toast from './components/toast/toast';
import Dialog from './components/dialog/dialog';
import TrackingMapProgress from './components/tracking-map-progress/tracking-map-progress'

import { withLoading, withToast } from './services/loading';
import { withTrackingMapProgress } from './services/tracking-map';
import { withDialog } from './services/dialog';

import googleAnalytics from './services/google-analytics/index';

const EnhancedSpinner = withLoading()(Spinner);
const EnhancedToast = withToast()(Toast);
const EnhancedDialog = withDialog()(Dialog);
const EnhancedTrackingMapProgress = withTrackingMapProgress()(TrackingMapProgress);

const GaMonitor = compose(
  withRouter,
  lifecycle({
    componentDidMount() {
      this.props.history.listen(location => {
        googleAnalytics.logScreenView(location.pathname);
      });
    },
  })
)(({ children }) => <div>{children}</div>);

export default ({}) => (
  <Fragment>
    <EnhancedTrackingMapProgress key="trackingMapProgress" />
    <EnhancedToast key="toast" />
    <EnhancedSpinner key="spinner" />
    <EnhancedDialog key="dialog" />
    <MemoryRouter key="router">
      <ConnectionMonitor>
        <GaMonitor>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/annotation/:args?"
              component={Annotation}
            />
            <Route
              exact
              path="/calibration-annotation/:args?"
              component={(...props) => (
                <Calibration {...props} nextView="/annotation" />
              )}
            />
            <Route
              exact
              path="/calibration-call/:args?"
              component={(...props) => (
                <Calibration {...props} nextView="/call" />
              )}
            />
            <Route exact path="/call/:args?" component={Call} />
            <Route
              exact
              path="/call-admin/:args?"
              component={(...props) => <Call admin {...props} />}
            />
            <Route
              exact
              path="/user-selection/:args?"
              component={UserSelection}
            />
            <Route
              exact
              path="/product-selection/:args?"
              component={ProductSelection}
            />
            <Route
              exact
              path="/annotation-selection/:args?"
              component={AnnotationSelection}
            />
            <Route exact path="/review/:args?" component={Review} />
          </Switch>
        </GaMonitor>
      </ConnectionMonitor>
    </MemoryRouter>
  </Fragment>
);
