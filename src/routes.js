import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from './containers/App'
import Home from './containers/Home'
import NotFound from './containers/NotFound'

class AppRouter extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
}

export default AppRouter;
