import React, { Component, PropTypes } from 'react';
import TrainerRow from './TrainerRow';

class TrainerList extends Component {
  render() {
    const trainerRows = this.props.trainers.map((trainer, index) =>
      <TrainerRow trainer={trainer} key={`trainer-${index}`} />
    );

    return (
      <div className="TrainerList">
        {trainerRows}
      </div>
    );
  }
}

TrainerList.propTypes = {
  trainers: PropTypes.array.isRequired
}

export default TrainerList;
