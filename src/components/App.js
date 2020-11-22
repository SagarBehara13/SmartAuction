import React, { Component } from 'react';
import logo from '../logo.png';
import Main from './Main'
import './App.css';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Main />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
