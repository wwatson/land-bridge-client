import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h2>Home Page Component</h2>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/conversation">Conversation</Link>
        </div>
        <div>
          <Link to="/trainer">Trainer</Link>
        </div>
        <div>
          <Link to="/subscriber">Subscriber</Link>
        </div>
      </div>
    );
  }
}

export default Home;
