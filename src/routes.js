import React from 'react'
import { Router, Route, IndexRoute, hashHistory, withRouter } from 'react-router'

import App from './containers/App'
import Home from './containers/Home'
import Login from './containers/Login'
import Conversation from './containers/Conversation'
import Subscriber from './containers/Subscriber'
import Trainer from './containers/Trainer'
import TrainerSession from './containers/TrainerSession'
import NotFound from './containers/NotFound'

const RoutedTrainerSession = withRouter(TrainerSession);

class AppRouter extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="conversation" component={Conversation} />
          <Route path="/login/:userType" component={Login} />
          <Route path="subscriber" component={Subscriber} />
          <Route path="trainer" component={Trainer} />
          <Route path="trainer-session" component={RoutedTrainerSession} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
}

export default AppRouter;
