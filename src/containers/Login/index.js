import React from 'react';
import { hashHistory } from 'react-router'
import { Button } from 'react-bootstrap';

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
    fetch('https://fvusi63s5g.execute-api.us-west-2.amazonaws.com/Test/loginIDM', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.username + ':' + this.state.password)
      }
    }).then(function(response) {
      console.log(response.headers.get('Content-Type'));
      console.log(response.headers.get('Date'));
      console.log(response.status);
      console.log(response.statusText);
      this.setState({user: response.data});

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
      <div>Login Page Component</div>
        <form className="loginForm" onSubmit={this.handleLogin}>
          <input
            type="text"
            placeholder="email address"
            value={this.state.username}
            onChange={this.handleUserChange}
          />
          <input
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <Button type="submit" value="Post"
                  bsStyle="success"
                  bsSize="large">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  user: React.PropTypes.object
};

export default Login;
