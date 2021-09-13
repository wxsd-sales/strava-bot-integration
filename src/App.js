import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import AuthRedirect from "./Components/AuthRedirect";
import Welcome from "./Components/Welcome";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/redirect" component={AuthRedirect} />
            <Route path="/welcome-page" component={Welcome} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
