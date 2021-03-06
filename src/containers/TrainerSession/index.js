/**
 * TrainerSession Page
 *
 * This is the page we show as a landing page for trainers
 */

import React, { Component, PropTypes } from 'react';
import { ProgressBar } from 'react-bootstrap';

import TwilioCommon from 'twilio-common';
import TwilioConversations from 'twilio-conversations';

import request from '../../utils/request.js';
import ConversationContainer from '../Conversation/ConversationContainer';

const URL_BASE = process.env.REACT_APP_TOKEN_API_ENDPOINT_BASE;

const INVITE_REJECTED = 'CONVERSATION_INVITE_REJECTED';

class TrainerSession extends Component {
  constructor(props) {
    super(props);

    this.handleGetTokenSuccess = this.handleGetTokenSuccess.bind(this);
    this.handleGetTokenError = this.handleGetTokenError.bind(this);
    this.conversationStarted = this.conversationStarted.bind(this);
    this.disconnectActiveConversation = this.disconnectActiveConversation.bind(this);

    const user = JSON.parse(localStorage.user);
    this.state = {
      trainer: this.props.location.state.trainer,
      identity: '',
      connectToIdentity: '',
      identityLocked: false,
      accessToken: false,
      isLoadingToken: false,
      connectingToConversation: false,
      conversationsClient: false,
      previewMedia: null,
      activeConversation: null,
      user
    };
  }

  componentWillMount() {
    // if LocationState doesn't exist, send them back to the /subscriber page
    if (!this.props.location.state) {
      this.props.router.push('/subscriber');
    }
  }

  componentDidMount() {
    this.getToken(this.state.user.guid);
  }

  handleGetTokenSuccess(data) {
    const self = this;
    console.log('token request successful');
    console.log(`token: ${data.token}`);

    const twilioAccessToken = data.token;

    // Create AccessManager
    var accessManager = new TwilioCommon.AccessManager(twilioAccessToken);

    const conversationsClient = new TwilioConversations.Client(accessManager);
    conversationsClient.inviteToConversation(this.state.trainer.guid).then(
      this.conversationStarted,
      function (error) {
        if (error.name === INVITE_REJECTED) {
          self.props.router.push({
            pathname: '/subscriber',
            state: {
              flash: {
                status: 'danger',
                message: 'You invitation was declined.'
              }
            }
          });
        } else {
          console.log('Unable to create conversation');
          console.error('Unable to create conversation', error);
        }
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
        routeToAfter:'/subscriber'
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

    let progressBarContent;
    if (!this.state.activeConversation) {
      progressBarContent = (
        <div>
          <p>Attempting to connect with {this.state.trainer.fullname}</p>
          <ProgressBar active now={50}/>
        </div>
      );
    }

    return (
      <div className="TrainerSession">
        {progressBarContent}
        <div className="">
          {conversationContent}
        </div>
      </div>
    );
  }
}

TrainerSession.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object,
}

export default TrainerSession;
