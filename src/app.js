import { MemoryRouter, Route, Switch, withRouter } from 'react-router';
import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { hot } from 'react-hot-loader/root';

import { ContextInjector } from './utils/ViewarContext/ViewarContext';
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
import { LoadingOverlay, Toast, Dialog, TrackingMapProgress } from './components';
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
      this.props.history.listen((location) => {
        googleAnalytics.logScreenView(location.pathname);
      });
    },
  })
)(({ children }) => <div>{children}</div>);

const EnhancedSpinner = withLoading()(LoadingOverlay);
const EnhancedToast = withToast()(Toast);
const EnhancedDialog = withDialog()(Dialog);
const EnhancedTrackingMapProgress = withTrackingMapProgress()(TrackingMapProgress);
const AdditionalComponents = () => (
  <Fragment>
    <EnhancedTrackingMapProgress />
    <EnhancedToast />
    <EnhancedSpinner />
    <EnhancedDialog />
  </Fragment>
);

const RouteWithContext = ({ component, ...rest }) => {
  const ComponentWithContext = ContextInjector(component);

  return <Route {...rest} component={(props) => <ComponentWithContext {...props} />} />;
};

const ConnectionMonitorWithContext = ContextInjector(ConnectionMonitor);

class App extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <AdditionalComponents />
        <MemoryRouter>
          <ConnectionMonitorWithContext>
            <GaMonitor>
              <Switch>
                <RouteWithContext exact path="/" component={HomeView} />
                <RouteWithContext
                  exact
                  path="/annotation/:args?"
                  component={AnnotationView}
                />
                <RouteWithContext
                  exact
                  path="/calibration-annotation/:args?"
                  component={(props) => (
                    <CalibrationView {...props} nextView="/annotation" />
                  )}
                />
                <RouteWithContext
                  exact
                  path="/calibration-call/:args?"
                  component={(props) => <CalibrationView {...props} nextView="/call" />}
                />
                <RouteWithContext exact path="/call/:args?" component={CallView} />
                <RouteWithContext
                  exact
                  path="/call-admin/:args?"
                  component={(props) => <CallView admin {...props} />}
                />
                <RouteWithContext
                  exact
                  path="/user-selection/:args?"
                  component={UserSelectionView}
                />
                <RouteWithContext
                  exact
                  path="/product-selection/:args?"
                  component={ProductSelectionView}
                />
                <RouteWithContext exact path="/review/:args?" component={ReviewView} />
              </Switch>
            </GaMonitor>
          </ConnectionMonitorWithContext>
        </MemoryRouter>
      </Fragment>
    );
  }
}

export default hot(App);
