import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import avatar from './avatar-empty.png';
import { Panel, Glyphicon, Button } from 'react-bootstrap';

class TrainerRow extends Component {
  render () {
    const trainerSessionLinkDescriptor = {
      pathname: "/trainer-session",
      state: {
        trainer: this.props.trainer
      }
    }

    return (
      <Panel className="TrainerRow" header={this.props.trainer.fullname} bsStyle="primary">
        <div className="TrainerRow__avatar">
          <img src={avatar} className="Trainer-logo" alt="logo" />
        </div>
        <div className="TrainerRow__rating">
          {this.props.trainer.starrating} Stars
        </div>

        <div className="TrainerRow__connect">
          <LinkContainer to={trainerSessionLinkDescriptor} ><Button bsStyle="success" block>Connect</Button></LinkContainer>
        </div>
      </Panel>
    );
  }
}

TrainerRow.propTypes = {
  trainer: PropTypes.object.isRequired
};

export default TrainerRow;
