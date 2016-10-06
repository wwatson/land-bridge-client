const React = require('react');

class ConversationContainer extends React.Component {
  componentDidMount() {
    const conversation = this.props.conversation;
    conversation.localMedia.attach(this.refs.localMedia);

    conversation.on('participantConnected', participant => {
      participant.media.attach(this.refs.remoteMedia);
    });
  }

  componentWillUnmount() {
    const conversation = this.props.conversation;
    conversation.localMedia.stop();
    conversation.disconnect();
  }

  render() {
    return (
      <div>
        <div ref='remoteMedia' className='media-container'></div>
        <div ref='localMedia' className='media-container'></div>
      </div>
    );
  }
}

ConversationContainer.propTypes = {
  conversation: React.PropTypes.object.isRequired
};

export default ConversationContainer;
