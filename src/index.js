import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import {isUserSignedIn} from 'blockstack';
import AuthHandler from './components/auth-handler';
import AsyncProvider from './components/async-provider';
import Landing from './routes/landing';
import Dashboard from './routes/dashboard';
import Auth from './routes/auth';
import BlockstackStore from './stores/blockstack';
import CoinbaseStore from './stores/coinbase';
import './style.css';

const signedOutOnly = props => (
  isUserSignedIn() ? <Redirect to="/dashboard"/> : <Landing {...props}/>
);

const signedInOnly = Screen => props => (
  isUserSignedIn() ? <Screen {...props}/> : <Redirect to="/"/>
);

const stores = {
  blockstack: new BlockstackStore(),
  coinbase: new CoinbaseStore()
};

const App = () => (
  <BrowserRouter>
    <AsyncProvider stores={stores}>
      <AuthHandler>
        <div>
          <Route exact path="/" render={signedOutOnly}/>
          <Route exact path="/dashboard" render={signedInOnly(Dashboard)}/>
          <Route exact path="/auth" render={signedInOnly(Auth)}/>
        </div>
      </AuthHandler>
    </AsyncProvider>
  </BrowserRouter>
);

ReactDOM.render(<App/>, document.getElementById('root'));
