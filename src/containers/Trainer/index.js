/**
 * Trainer Page
 *
 * This is the page we show as a landing page for trainers
 */

import React, { Component } from 'react';
import TwilioCommon from 'twilio-common';
import TwilioConversations from 'twilio-conversations';

import request from '../../utils/request.js';

import ConversationContainer from '../Conversation/ConversationContainer';

import avatar from '../Subscriber/avatar-empty.png';
import { Button, Modal } from 'react-bootstrap';

const URL_BASE = process.env.REACT_APP_TOKEN_API_ENDPOINT_BASE;

class Trainer extends Component {
  constructor(props) {
    super(props);

    this.handleGetTokenSuccess = this.handleGetTokenSuccess.bind(this);
    this.handleGetTokenError = this.handleGetTokenError.bind(this);
    this.conversationStarted = this.conversationStarted.bind(this);
    this.disconnectActiveConversation = this.disconnectActiveConversation.bind(this);
    this.handleInvitation = this.handleInvitation.bind(this);
    this.acceptInvitation = this.acceptInvitation.bind(this);
    this.rejectInvitation = this.rejectInvitation.bind(this);

    const user = JSON.parse(localStorage.user);
    this.state = {
      identity: '',
      connectToIdentity: '',
      identityLocked: false,
      accessToken: false,
      isLoadingToken: false,
      connectingToConversation: false,
      conversationsClient: false,
      previewMedia: null,
      activeConversation: null,
      user: user,
      showModal: false,
      incomingInvitation: false
    };
  }

  componentDidMount() {
    this.getToken('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB');
    // this.getToken(this.state.user.guid);
  }

  handleInvitation(invite) {
    this.setState({
      incomingInvitation: invite,
      showModal: true
    });
  }

  acceptInvitation(ev) {
    ev.preventDefault();
    this.setState({
      incomingInvitation: false,
      showModal: false
    });
    this.state.incomingInvitation.accept().then(this.conversationStarted, () => {
      console.log('error in accepting')
    });
  }

  rejectInvitation(ev) {
    ev.preventDefault();
    this.setState({
      incomingInvitation: false,
      showModal: false
    });
    this.state.incomingInvitation.reject();
  }

  handleGetTokenSuccess(data) {
    var self = this;
    console.log('token request successful');
    console.log(`token: ${data.token}`);

    const twilioAccessToken = data.token;

    // Create AccessManager
    var accessManager = new TwilioCommon.AccessManager(twilioAccessToken);

    const conversationsClient = new TwilioConversations.Client(accessManager);
    conversationsClient.listen().then(function() {
      console.log('Connected to Twilio!');

      conversationsClient.on('invite', self.handleInvitation);
    }, function (error) {
      console.log('Could not connect to Twilio: ' + error.message);
    });

    this.setState({
      conversationsClient,
      accessToken: twilioAccessToken
    });
  }

  handleGetTokenError() {
    console.log('token request errored');
  }

  getToken(identity) {
    request(`${URL_BASE}/token?identity=${identity}`)
      .then(this.handleGetTokenSuccess, this.handleGetTokenError);
  }

  conversationStarted(conversation) {
    console.log('In an active Conversation');
    this.setState({
      connectingToConversation: false,
      activeConversation: conversation
    });

    conversation.on('disconnected', () => {
      this.disconnectActiveConversation();
    });
  }

  disconnectActiveConversation() {
    console.log('Disconnecting active conversation');
    this.setState({
      activeConversation: null
    });

    this.props.router.push({
      pathname: '/survey',
      state: {
        routeToAfter:'/trainer'
      }
    });
  }

  render() {
    let conversationContent;
    if (this.state.connectingToConversation) {
      conversationContent = (<div>Connecting...</div>);
    } else if(this.state.activeConversation) {
      conversationContent =
      (
        <div>
          <ConversationContainer conversation={this.state.activeConversation} />

          <div>
            <button onClick={this.disconnectActiveConversation}>Disconnect</button>
          </div>
        </div>
      );
    }

    let availabilityContent;
    if (this.state.accessToken) {
      availabilityContent = (<div>Waiting for subscribers</div>)
    } else {
      availabilityContent = (<div>Disconnected</div>);
    }

    return (
      <div className="Trainer">
        <div className="Trainer__header">
          Trainer
        </div>

        <div className="Trainer__body">
          <div className="panel">
            <div className="Trainer__name">
              {`${this.state.user.firstName} ${this.state.user.lastName}`}
            </div>

            <div className="Trainer__avatar">
              <img src={avatar} className="Trainer-logo" alt="logo" />
            </div>

            <div className="Trainer__availability">
              {availabilityContent}
            </div>
          </div>

          <hr />

          {conversationContent}
        </div>

        <Modal show={this.state.showModal}>
          <Modal.Header>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="danger" onClick={this.rejectInvitation}>Reject</Button>
            <Button className="primary" onClick={this.acceptInvitation}>Accept</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default Trainer;
