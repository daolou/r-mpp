import React, { Component } from 'react'
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import ErrorBoundary from '../../../components/ErrorBoundary'
import Index from './components/Index'
import Questions from './components/Questions'


class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Switch>
            <Route exact path='/index.html' component={Index} />
            <Route exact path='/questions.html' component={Questions} />
            <Redirect to='/index.html' />
          </Switch>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;