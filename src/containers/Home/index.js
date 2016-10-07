import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import bbod_logo from './bbod.png';
import bbl_logo from './logo_bb_live-centered.png';

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <div className="Home__trainer row">
          <p><img src={bbl_logo} alt="BB LIVE!" /></p>
          <LinkContainer to="/login/trainer" ><Button bsStyle="success" bsSize="large" block>Trainer</Button></LinkContainer>
        </div>
        <div className="Home__subscriber row">
          <p><img src={bbod_logo} alt="Beachbody On Demand" /></p>
          <LinkContainer to="/login/subscriber"><Button bsStyle="primary" bsSize="large" block>Subscriber</Button></LinkContainer>
        </div>
      </div>
    );
  }
}

export default Home;
