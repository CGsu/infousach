import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//
import { Route } from "react-router-dom";
import Home from "./components/home/Home";

class App extends Component {
  render() {
    return (
        <Route component={Home} />
    );
  }
}

export default App;
