import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Headers from './pages/Headers';

function App() {
  return (
    <div className="App">
      <Headers/>
      <Home/>
    </div>
  );
}

export default App;
