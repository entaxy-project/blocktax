import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import {isUserSignedIn} from 'blockstack';
import 'bootstrap/dist/css/bootstrap.css';
import Container from './components/container';
import Landing from './routes/landing';
import Dashboard from './routes/dashboard';
import './styles/style.css';

const signedOutOnly = () => (
  isUserSignedIn() ? <Redirect to="/dashboard"/> : <Landing/>
);

const signedInOnly = Screen => () => (
  isUserSignedIn() ? <Screen/> : <Redirect to="/"/>
);

const App = () => (
  <BrowserRouter>
    <Container>
      <Route exact path="/" render={signedOutOnly}/>
      <Route exact path="/dashboard" render={signedInOnly(Dashboard)}/>
    </Container>
  </BrowserRouter>
);

ReactDOM.render(<App/>, document.getElementById('root'));
