import React from 'react';
import TwilioCommon from 'twilio-common';
import TwilioConversations from 'twilio-conversations';
import ConversationContainer from './ConversationContainer';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.handleIdentityChange = this.handleIdentityChange.bind(this);
    this.handleConnectToIdentityChange = this.handleConnectToIdentityChange.bind(this);
    this.connectToConversation = this.connectToConversation.bind(this);
    this.conversationStarted = this.conversationStarted.bind(this);
    this.disconnectActiveConversation = this.disconnectActiveConversation.bind(this);
    this.setIdentity = this.setIdentity.bind(this);

    this.state = {
      identity: '',
      connectToIdentity: '',
      identityLocked: false,
      accessToken: false,
      isLoadingToken: false,
      connectingToConversation: false,
      conversationsClient: false,
      previewMedia: null,
      activeConversation: null
    }
  }

  handleIdentityChange(ev) {
    this.setState({
      identity: ev.target.value
    })
  }

  handleConnectToIdentityChange(ev) {
    this.setState({
      connectToIdentity: ev.target.value
    })
  }

  connectToConversation(ev) {
    ev.preventDefault();
    if (this.state.connectToIdentity && this.state.conversationsClient)  {
      this.setState({
        connectingToConversation: true
      });

      this.state.conversationsClient.inviteToConversation(this.state.connectToIdentity).then(
        this.conversationStarted,
        function (error) {
          console.log('Unable to create conversation');
          console.error('Unable to create conversation', error);
        });
    }
  }

  /*
   * Handlers
  */
  setIdentity(ev) {
    ev.preventDefault();

    if(this.state.identity)
    this.setState({
      identityLocked: true
    });

    this.getToken(this.state.identity);
  }

  getToken(identity) {
    const self = this;
    const URL_BASE = process.env.REACT_APP_TOKEN_API_ENDPOINT_BASE;
    fetch(`${URL_BASE}/token?identity=${identity}`)
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        console.log('token request successful');
        console.log(`token: ${data.token}`);

        const twilioAccessToken = data.token;

        // Create AccessManager
        var accessManager = new TwilioCommon.AccessManager(twilioAccessToken);

        const conversationsClient = new TwilioConversations.Client(accessManager);
        conversationsClient.listen().then(function() {
          console.log('Connected to Twilio!');

          conversationsClient.on('invite', function (invite) {
            console.log('Incoming invite from: ' + invite.from);
            invite.accept().then(self.conversationStarted, () => {
              console.log('error in accepting')
            });
          });
        }, function (error) {
          console.log('Could not connect to Twilio: ' + error.message);
        });

        this.setState({
          conversationsClient,
          accessToken: twilioAccessToken
        });
      }, () => {
        console.log('token request errored');
      });
  }

  conversationStarted(conversation) {

    console.log('In an active Conversation');
    this.setState({
      connectingToConversation: false,
      activeConversation: conversation
    });
  }

  disconnectActiveConversation() {
    console.log('Disconnecting active conversation');
    this.setState({
      activeConversation: null
    });
  }

  render() {
    let conversationContent;
    if (this.state.connectingToConversation) {
      conversationContent = (<div>Connecting...</div>);
    } else if(this.state.activeConversation) {
      conversationContent = <ConversationContainer conversation={this.state.activeConversation} />
    }

    let connectingContent;
    if (this.state.accessToken) {
      connectingContent = (
        <div>
          <div>
            <label>Connect to Identity</label>
            <input value={this.state.connectToIdentity} onChange={this.handleConnectToIdentityChange} />
          </div>

          <div>
            <button onClick={this.connectToConversation}>Connect</button>
          </div>

          {conversationContent}

          <div>
            <button onClick={this.disconnectActiveConversation}>Disconnect</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2>Conversation Page Component</h2>
        <div>
          <div>
            <label>Twilio Identity</label>
            <input value={this.state.identity} onChange={this.handleIdentityChange} disabled={this.state.identityLocked} />
          </div>

          <div>
            <button onClick={this.setIdentity}>Set Identity</button>
          </div>

          <div>
            Token set?: { this.state.accessToken ? 'Yes' : 'No'}
          </div>
        </div>

        {connectingContent}
      </div>
    );
  }
}

export default Conversation;
