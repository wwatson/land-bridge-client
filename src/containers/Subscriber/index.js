/**
 * Subscriber Page
 *
 * This is the page we show as a landing page for subscribers
 */

import React, { Component } from 'react';
import TrainerList from './TrainerList';
import request from '../../utils/request';
import avatar from './avatar-empty.png';

const URL_BASE = process.env.REACT_APP_TOKEN_API_ENDPOINT_BASE;

class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.handleGetTrainersSuccess = this.handleGetTrainersSuccess.bind(this);
    this.handleGetTrainersError = this.handleGetTrainersError.bind(this);

    let flashMessage = false;
    let flashStatus = false;

    if (this.props.location.state && this.props.location.state.flash) {
      flashMessage = this.props.location.state.flash.message;
      flashStatus = this.props.location.state.flash.status;
    }

    const user = JSON.parse(localStorage.user);
    this.state = {
      flashMessage: flashMessage,
      flashStatus: flashStatus,
      isLoadingTrainers: false,
      getTrainersLoadError: false,
      trainers: false,
      user
    };
  }

  componentDidMount() {
    this.getTrainers();
  }

  getTrainers() {
    this.setState({
      isLoadingTrainers: true,
      getTrainersLoadError: false,
      trainers: false
    });
    const url = `${URL_BASE}/user`;
    request(url).then(this.handleGetTrainersSuccess).catch(this.handleGetTrainersError);
  }

  handleGetTrainersSuccess(data) {
    const filteredTrainers = data.filter((trainer) => {
      return trainer.issubscriber !== 'true';
    });

    this.setState({
      isLoadingTrainers: false,
      trainers: filteredTrainers
    });
  }

  handleGetTrainersError(error) {
    this.setState({
      isLoadingTrainers: false,
      getTrainersLoadError: error
    });
  }

  render() {
    let flashContent;

    if (this.state.flashMessage && this.state.flashStatus) {
      const alertClassName = `alert alert-${this.state.flashStatus}`;
      flashContent = (<div className={alertClassName}>{this.state.flashMessage}</div>)
    }

    let trainersContent;
    if (this.state.isLoadingTrainers) {
      trainersContent = (<div>Loading...</div>);
    } else if (this.state.getTrainersLoadError) {
      trainersContent = (
        <div className="alert alert-danger">
          There was an error loading the list of trainers. Please refresh and try again.
        </div>
      );
    } else if (this.state.trainers) {
      trainersContent = (
        <TrainerList trainers={this.state.trainers} />
      );
    }

    return (
      <div className="Subscriber">
        {flashContent}

        <h2 className="Subscriber__header">Subscriber</h2>

        <div className="Subscriber__body">
          <div className="panel">
            <div className="Subscriber__details panel-body">
              <div className="Subscriber__name">
                {`${this.state.user.firstName} ${this.state.user.lastName}`}
              </div>

              <div className="Subscriber__avatar">
                <img src={avatar} className="Trainer-logo" alt="logo" />
              </div>
            </div>
          </div>

          <hr />

          <div className="Subscriber__trainer-list">
            {trainersContent}
          </div>
        </div>
      </div>
    );
  }
}

export default Subscriber;
