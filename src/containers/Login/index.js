import React from 'react';
import { Button } from 'react-bootstrap';
import { hashHistory } from 'react-router'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText);
    error.response = response;
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
      password: ''
    }
  }

  handleLogin(event) {
    event.preventDefault();
    fetch('https://token.bbtrain.me/idm', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.username + ':' + this.state.password)
      }
    }).then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        console.log('I COMPLETED');
        // localStorage.setItem( 'user', JSON.stringify( data ));
        const userType = this.props.params.userType;
        console.log("userType: " + userType);
        hashHistory.push( userType );
        // this.callSetTrainer();


        // hashHistory.push('/conversation')
    });
  }

  callSetTrainer() {
    const updatedUser = {
      "guid" : this.state.user.guid,
      "fullname" : this.state.user.firstName + " " + this.state.user.lastName,
      "available" : "yes",
      "starrating" : "5"
    };
    console.log(updatedUser);
    fetch('https://iupvv9x848.execute-api.us-west-2.amazonaws.com/test/registertrainer', {
      method: 'POST',
      body: updatedUser
    }).then(checkStatus)
      .then((data) => {
        console.log('success');

        // hashHistory.push('/conversation')
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

export default Login;
