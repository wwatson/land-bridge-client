import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class TrainerRow extends Component {
  render () {
    return (
      <div className="TrainerRow">
        <div className="TrainerRow__name">
          {this.props.trainer.fullname}
        </div>
        <div className="TrainerRow__rating">
          {this.props.trainer.starrating}
        </div>
        <div>
          <Link to="/trainer-session">Connect</Link>
        </div>
      </div>
    );
  }
}

TrainerRow.propTypes = {
  trainer: PropTypes.object.isRequired
};

export default TrainerRow;
