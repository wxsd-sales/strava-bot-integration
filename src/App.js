import React, { Component } from 'react';
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../src/components/Home";
import AuthRedirect from "../src/components/AuthRedirect";
import Distance from "../src/components/Distance";

class App extends Component {
  render() {
    return(
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/redirect" component={AuthRedirect} />
            <Route path="/yourdistance" component={Distance} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
};

export default App;

