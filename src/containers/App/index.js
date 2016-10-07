import React from 'react';
import logo from './beachbody-new-logo.png';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { LinkContainer } from 'react-router-bootstrap';

function App(props) {
  return (
    <div className="App">
      <div className="App__header">
        <LinkContainer to="/"><img src={logo} className="App-logo" alt="logo" /></LinkContainer>
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
