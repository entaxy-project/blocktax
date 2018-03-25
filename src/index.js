import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect} from 'react-router-dom';
import {isUserSignedIn} from 'blockstack';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import AuthHandler from './components/auth-handler';
import AsyncProvider from './components/async-provider';
import Landing from './components/landing';
import Import from './components/import';
import ImportFromCoinbase from './components/import-from-coinbase';
import TransactionList from './components/transaction-list';
import TaxEventList from './components/tax-event-list';
import BlockstackStore from './stores/blockstack';
import CoinbaseStore from './stores/coinbase';
import UIStore from './stores/ui';
import './style.css';

const signedOutOnly = props => (
  isUserSignedIn() ? <Redirect to="/transactions"/> : <Landing {...props}/>
);

const loginRequired = Screen => props => {
  if(isUserSignedIn()) {
    return <Screen {...props}/>
  } else {
    return <Redirect to="/"/>
  }
};

const router = new RouterStore();
const blockstack = new BlockstackStore(router);
const coinbase = new CoinbaseStore();
const ui = new UIStore(blockstack, coinbase);
const history = syncHistoryWithStore(createBrowserHistory(), router);

const App = () => (
  <Router history={history} basename={process.env.PUBLIC_URL}>
    <AsyncProvider stores={{blockstack, coinbase, ui, router}}>
      <AuthHandler>
        <div>
          <Route exact path="/" render={signedOutOnly}/>
          <Route exact path="/auth" render={loginRequired(ImportFromCoinbase)}/>
          <Route exact path="/transactions" render={loginRequired(TransactionList)}/>
          <Route exact path="/capital-gains" render={loginRequired(TaxEventList)}/>
          <Route exact path="/import" render={loginRequired(Import)}/>
        </div>
      </AuthHandler>
    </AsyncProvider>
  </Router>
);

ReactDOM.render(<App/>, document.getElementById('root'));
