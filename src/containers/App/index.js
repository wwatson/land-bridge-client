import React from 'react';
import logo from './beachbody-new-logo.png';
import './index.css';

function App(props) {
  return (
    <div className="App">
      <div className="App__header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <div className="App__body">
        {React.Children.toArray(props.children)}
      </div>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node
}

export default App;
