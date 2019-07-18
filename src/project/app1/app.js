import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './app.less';
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import ErrorBoundary from '~src/components/ErrorBoundary';
import AsyncComponent from '~src/components/AsyncComponent';
import paths from '~build/paths';
const Index = AsyncComponent(() =>
  import(/* webpackChunkName: 'index' */
  // /* webpackPrefetch: true */
  './pages/Index')
);
const Questions = AsyncComponent(() =>
  import(/* webpackChunkName: 'questions' */
  // /* webpackPrefetch: true */
  './pages/Questions')
);

const FastClick = require('fastclick');

FastClick.attach(document.body);

// @withRouter()
class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <Switch>
            <Route exact path={`${paths.public}index`} component={Index} />
            <Route exact path={`${paths.public}questions`} component={Questions} />
            <Redirect to={`${paths.public}index`} />
          </Switch>
        </Router>
      </ErrorBoundary>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
