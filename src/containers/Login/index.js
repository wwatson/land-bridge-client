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
    this.handlePushToUserView = this.handlePushToUserView.bind(this);

    this.guidExists = false;

    this.state = {
      username: '',
      password: '',
      user: null
    }
  }

  handleLogin(event) {
    // If an existing user exists already, clear it from the storage.
    // If we want, later, we can use this GUID to auto login and skip this step.
    if(localStorage.user){
      localStorage.removeItem( 'user' );
    }

    var restoredGuidObjects = { 'guids' : [] };

    if(localStorage.guidObject){
      restoredGuidObjects = JSON.parse(localStorage.guidObject);
    }

    event.preventDefault();
    fetch('https://token.bbtrain.me/idm', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.username + ':' + this.state.password)
      }
    }).then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        if(restoredGuidObjects.guids.length > 0){
          var index = restoredGuidObjects.guids.indexOf(data.guid);
          if(index > -1){
            this.guidExists = true;
          }else{
            restoredGuidObjects.guids[restoredGuidObjects.guids.length] = data.guid;
          }
        } else {
          restoredGuidObjects.guids[0] = data.guid;
        }

        localStorage.guidObject = JSON.stringify(restoredGuidObjects);
        localStorage.user = JSON.stringify( data );
        this.setState({user: data});
    });
  }

  setUser() {
    fetch('https://token.bbtrain.me/user', {
      method: 'POST',
      body: JSON.stringify({
        "guid" : this.state.user.guid,
        "fullname" : this.state.user.firstName + " " + this.state.user.lastName,
        "available" : "no",
        "starrating" : "4"
      })
    }).then(checkStatus)
      .then(() => {
        this.handlePushToUserView();
      });
  }

  // Handler for the push state for the trainer/subscriber containers
  handlePushToUserView() {
    const userType = this.props.params.userType;
    hashHistory.push( userType );
  }

  handleUserChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  render() {
    const user = this.state.user;
    if( user ){
      if(this.guidExists){
        this.handlePushToUserView();
      } else {
        this.setUser();
      }
    }
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
