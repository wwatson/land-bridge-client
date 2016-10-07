const React = require('react');

class ConversationContainer extends React.Component {
  componentDidMount() {
    const conversation = this.props.conversation;
    conversation.localMedia.attach(this.refs.localMedia);

    conversation.on('participantConnected', participant => {
      console.log("Participant '" + participant.identity + "' connected");
      participant.media.attach(this.refs.remoteMedia);
    });

    conversation.on('participantDisconnected', function (participant) {
      console.log("Participant '" + participant.identity + "' disconnected");
    });
  }

  componentWillUnmount() {
    const conversation = this.props.conversation;
    conversation.localMedia.stop();

    try {
      conversation.disconnect();
    } catch(err) { // If the conversation has already been disconnected, an error will be thrown
      //do nothing
    }
  }

  render() {
    return (
      <div class="media-container">
        <div class="video-container">
          <div class="video-remote" ref='remoteMedia'></div>
          <div class="video-local" ref='localMedia'></div>
        </div>
      </div>
    );
  }
}

ConversationContainer.propTypes = {
  conversation: React.PropTypes.object.isRequired
};

export default ConversationContainer;
