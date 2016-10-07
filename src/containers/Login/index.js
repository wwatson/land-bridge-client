import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
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

  postUser( is_subscriber ) {
    fetch('https://token.bbtrain.me/user', {
      method: 'POST',
      body: JSON.stringify({
        "guid" : this.state.user.guid,
        "fullname" : this.state.user.firstName + " " + this.state.user.lastName,
        "available" : "true",
        "starrating" : "0",
        "issubscriber": is_subscriber.toString()
      })
    }).then(checkStatus)
      .then(() => {
        this.handlePushToUserView();
      });
  }

  // Handler for the push state for the trainer/subscriber containers
  putUser( is_subscriber ) {
    fetch('https://token.bbtrain.me/user', {
      method: 'POST',
      body: JSON.stringify({
        "guid" : this.state.user.guid,
        "fullname" : this.state.user.firstName + " " + this.state.user.lastName,
        "available" : "true",
        "starrating" : "5",
        "issubscriber": is_subscriber.toString()
      })
    }).then(checkStatus)
      .then(() => {
        this.handlePushToUserView();
      });
  }

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
    const userType = this.props.params.userType;
    let is_subscriber = false;
    if( userType === "subscriber" ) {
      is_subscriber = true;
    }
    if( user ){
      if(this.guidExists){
        this.putUser( is_subscriber );
      } else {
        this.postUser( is_subscriber );
      }
    }
    return (
      <div>
        <form className="loginForm" onSubmit={this.handleLogin}>
          <FormGroup>
            <ControlLabel>Email Address</ControlLabel>
            <FormControl type="text" placeholder="Enter email address" value={this.state.username} onChange={this.handleUserChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" placeholder="Enter password" value={this.state.password} onChange={this.handlePasswordChange} />
          </FormGroup>
          <Button type="submit" value="Post"
                  bsStyle="success">Go!</Button>
        </form>
      </div>
    );
  }
}

export default Login;
