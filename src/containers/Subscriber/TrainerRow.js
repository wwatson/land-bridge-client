import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import avatar from './avatar-empty.png';
import { Panel, Glyphicon } from 'react-bootstrap';

class TrainerRow extends Component {
  render () {
    return (
      <Panel className="TrainerRow" header={this.props.trainer.fullname} bsStyle="primary">
        <div className="TrainerRow__avatar">
          <img src={avatar} className="Trainer-logo" alt="logo" />
        </div>
        <div className="TrainerRow__rating">
          {this.props.trainer.starrating}
        </div>
        <div>
          <Link to="/trainer-session">Connect</Link>
        </div>
      </Panel>
    );
  }
}

TrainerRow.propTypes = {
  trainer: PropTypes.object.isRequired
};

export default TrainerRow;
