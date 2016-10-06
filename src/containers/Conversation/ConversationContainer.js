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
    } catch(err) {
      //do nothing
    }
  }

  render() {
    return (
      <div>
        <div>
          Remote
          <div ref='remoteMedia' className='media-container'></div>
        </div>

        <hr />

        <div>
          Local
          <div ref='localMedia' className='media-container'></div>
        </div>
      </div>
    );
  }
}

ConversationContainer.propTypes = {
  conversation: React.PropTypes.object.isRequired
};

export default ConversationContainer;
