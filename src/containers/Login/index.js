import React from 'react';
import { hashHistory } from 'react-router'
import { Button } from 'react-bootstrap';

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

class Login extends React.Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      username: '',
      password: '',
      user: null
    }
  }

  handleLogin(event) {
    fetch('https://token.bbtrain.me/idm', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.username + ':' + this.state.password)
      }
    }).then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        this.setState({user: data});
        hashHistory.push('/conversation')
    });
  }

  handleUserChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  render() {
    return (
      <div>
      <div>Login to Beachbody Club</div>
        <form className="loginForm" onSubmit={this.handleLogin}>
          <div className="row">
            <input
              type="text"
              placeholder="email address"
              value={this.state.username}
              onChange={this.handleUserChange}
            />
          </div>
          <div className="row">
            <input
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <Button type="submit" value="Post"
                  bsStyle="success">Go!</Button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  user: React.PropTypes.object
};

export default Login;
