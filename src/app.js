import { MemoryRouter, Route, Switch, withRouter } from 'react-router';
import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';

import {
  HomeView,
  CallView,
  AnnotationView,
  CalibrationView,
  ProductSelectionView,
  ReviewView,
  UserSelectionView,
  ConnectionMonitor,
} from './views';

import {
  LoadingOverlay,
  Toast,
  Dialog,
  TrackingMapProgress,
} from './components';

import {
  withLoading,
  withToast,
  withTrackingMapProgress,
  withDialog,
  googleAnalytics,
} from './services';

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

const EnhancedSpinner = withLoading()(LoadingOverlay);
const EnhancedToast = withToast()(Toast);
const EnhancedDialog = withDialog()(Dialog);
const EnhancedTrackingMapProgress = withTrackingMapProgress()(
  TrackingMapProgress
);
const AdditionalComponents = () => (
  <Fragment>
    <EnhancedTrackingMapProgress />
    <EnhancedToast />
    <EnhancedSpinner />
    <EnhancedDialog />
  </Fragment>
);

export default ({}) => (
  <Fragment>
    <AdditionalComponents />
    <MemoryRouter>
      <ConnectionMonitor>
        <GaMonitor>
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/annotation/:args?" component={AnnotationView} />
            <Route
              exact
              path="/calibration-annotation/:args?"
              component={(...props) => (
                <CalibrationView {...props} nextView="/annotation" />
              )}
            />
            <Route
              exact
              path="/calibration-call/:args?"
              component={(...props) => (
                <CalibrationView {...props} nextView="/call" />
              )}
            />
            <Route exact path="/call/:args?" component={CallView} />
            <Route
              exact
              path="/call-admin/:args?"
              component={(...props) => <CallView admin {...props} />}
            />
            <Route
              exact
              path="/user-selection/:args?"
              component={UserSelectionView}
            />
            <Route
              exact
              path="/product-selection/:args?"
              component={ProductSelectionView}
            />
            <Route exact path="/review/:args?" component={ReviewView} />
          </Switch>
        </GaMonitor>
      </ConnectionMonitor>
    </MemoryRouter>
  </Fragment>
);
