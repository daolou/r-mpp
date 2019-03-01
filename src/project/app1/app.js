import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './app.less';
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';
import AsyncComponent from '../../components/AsyncComponent';
const Index = AsyncComponent(() => import('./pages/Index'));
const Questions = AsyncComponent(() => import('./pages/Questions'));

// @withRouter()
class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <Switch>
            <Route exact path="/index.html" component={Index} />
            <Route exact path="/questions.html" component={Questions} />
            <Redirect to="/index.html" />
          </Switch>
        </Router>
      </ErrorBoundary>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
