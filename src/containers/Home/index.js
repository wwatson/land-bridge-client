import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <div className="Home__trainer row">
          <LinkContainer to="/login/trainer" ><Button bsStyle="success" bsSize="large" block>Trainer</Button></LinkContainer>
        </div>
        <div className="Home__subscriber row">
          <LinkContainer to="/login/subscriber"><Button bsStyle="primary" bsSize="large" block>Subscriber</Button></LinkContainer>
        </div>
      </div>
    );
  }
}

export default Home;
