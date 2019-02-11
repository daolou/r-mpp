import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../style/base-mediaquery.less';
import './app.less';
import {
  //   BrowserRouter,
  HashRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';
import Index from './pages/Index';
import Questions from './pages/Questions';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <HashRouter>
          <Switch>
            <Route exact path="/index.html" component={Index} />
            <Route exact path="/questions.html" component={Questions} />
            <Redirect to="/index.html" />
          </Switch>
        </HashRouter>
      </ErrorBoundary>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
