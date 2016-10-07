/**
 * Subscriber Page
 *
 * This is the page we show as a landing page for subscribers
 */

import React, { Component } from 'react';
import TrainerList from './TrainerList';

const STATIC_TRAINERS = [
  {
    guid: "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
    fullname: "Steve Polk",
    available: "yes",
    starrating: "5"
  },
  {
    guid: "BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB",
    fullname: "Cameron Brooks",
    available: "yes",
    starrating: "5"
  },
  {
    guid: "CCCCCCCC-CCCC-CCCC-CCCC-CCCCCCCCCCCC",
    fullname: "Ramesh Tirumala",
    available: "yes",
    starrating: "5"
  },
  {
    guid: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD",
    fullname: "Joseph Presley",
    available: "yes",
    starrating: "5"
  },
  {
    guid: "EEEEEEEE-EEEE-EEEE-EEEE-EEEEEEEEEEEE",
    fullname: "Will Watson",
    available: "yes",
    starrating: "5"
  }
];

class Subscriber extends Component {
  constructor(props) {
    super(props);

    let flashMessage = false;
    let flashStatus = false;

    if (this.props.location.state && this.props.location.state.flash) {
      flashMessage = this.props.location.state.flash.message;
      flashStatus = this.props.location.state.flash.status;
    }

    this.state = {
      trainers: STATIC_TRAINERS, // TODO: Fetch these when the API is ready
      flashMessage: flashMessage,
      flashStatus: flashStatus
    };
  }

  render() {
    let flashContent;

    if (this.state.flashMessage && this.state.flashStatus) {
      const alertClassName = `alert alert-${this.state.flashStatus}`;
      flashContent = (<div className={alertClassName}>{this.state.flashMessage}</div>)
    }

    return (
      <div className="Subscriber">
        {flashContent}

        <div className="Subscriber__header">
          <h2>Subscriber</h2>
        </div>

        <div className="Subscriber__body">
          <div className="Subscriber__details">Subscriber Info</div>
          <hr />
          <div className="Subscriber__trainer-list">
            <TrainerList trainers={this.state.trainers} />
          </div>
        </div>
      </div>
    );
  }
}

export default Subscriber;
