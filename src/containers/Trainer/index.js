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
import { Button, Modal, ProgressBar } from 'react-bootstrap';

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
    this.handleGetUserSuccess = this.handleGetUserSuccess.bind(this);
    this.handleGetUserError = this.handleGetUserError.bind(this);

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
    this.getToken(this.state.user.guid);
  }

  handleGetUserSuccess(data) {
    this.setState({
      incomingInvitationUser: data,
      showModal: true
    });
  }

  handleGetUserError(error) {
    console.log('error fetching user information');
  }

  handleInvitation(invite) {
    if (this.state.activeConversation) {
      invite.reject();
    } else {
      this.setState({
        incomingInvitation: invite
      });

      const guid = invite.from;
      request(`${URL_BASE}/user/${guid}`)
        .then(this.handleGetUserSuccess, this.handleGetUserError);
    }
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
    this.setState({
      isLoadingToken: true
    });

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

          <div className="disconnect-wrapper">
            <button className="btn btn-danger" onClick={this.disconnectActiveConversation}>Disconnect</button>
          </div>
        </div>
      );
    }

    let availabilityContent;
    if (this.state.accessToken && !this.state.activeConversation) {
      availabilityContent = (
        <div>
          <ProgressBar bsStyle="info" active now={50}/>
          Waiting for requests
        </div>
      );
    } else if (this.state.activeConversation) {
      availabilityContent = (
        <div>
          <ProgressBar bsStyle="success" now={100} />
          Connected
        </div>
      );

    } else {
      availabilityContent = (
        <div>
          <ProgressBar bsStyle="danger" now={100} />
          Disconnected
        </div>
      );
    }

    let invitationModal;
    if (this.state.showModal) {
      invitationModal = (
        <Modal show={this.state.showModal}>
          <Modal.Header>
            <Modal.Title>Incoming Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.incomingInvitationUser.fullname} is requesting you as a trainer. Please accept or reject or reject.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.rejectInvitation}>Reject</Button>
            <Button bsStyle="success" onClick={this.acceptInvitation}>Accept</Button>
          </Modal.Footer>
        </Modal>
      );
    }

    return (
      <div className="Trainer">
        <h2 className="Trainer__header">Trainer</h2>
        <div className="Trainer__body">
          <div className="Trainer__details panel">
            <div className="panel-body">
              <div className="Trainer__avatar">
                <img src={avatar} className="Trainer-logo" alt="logo" />
              </div>

              <div className="Trainer__name">
                {`${this.state.user.firstName} ${this.state.user.lastName}`}
              </div>

              <div className="Trainer__availability">
                {availabilityContent}
              </div>
            </div>
          </div>

          {conversationContent}
        </div>

        {invitationModal}
      </div>
    );
  }
}


export default Trainer;
