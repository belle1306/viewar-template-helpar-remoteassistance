import React from 'react';

export const ViewarContext = React.createContext({});

export class ViewarContextProvider extends React.PureComponent {
  constructor(props) {
    super(props);

    const { viewarApi, callClient } = props.modules;
    this.api = viewarApi;
    this.callClient = callClient;
  }

  render() {
    const { modules } = this.props;

    return (
      <ViewarContext.Provider value={{ modules }}>
        {this.props.children}
      </ViewarContext.Provider>
    );
  }
}

export const ContextInjector = (Component) => (props) => {
  return (
    <>
      <ViewarContext.Consumer>
        {(context) => {
          return Component({
            ...props,
            ...context.modules,
          });
        }}
      </ViewarContext.Consumer>
    </>
  );
};
