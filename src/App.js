import React, { Component } from 'react';
import logo from './logo.svg';
// import ReactCountdownClock from './ReactCountdownClock';
import Clock from './Clock';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Clock returnTime={ new Date("January 4, 2018 12:03:30") } />
      </div>
    );
  }
}

export default App;
