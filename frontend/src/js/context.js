import React, { Component } from "react";

const AppContext = React.createContext();

class ContextProvider extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <AppContext.Provider value={{
        ...this.props.value
      }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
const ContextConsumer = AppContext.Consumer;
export { ContextProvider, ContextConsumer };