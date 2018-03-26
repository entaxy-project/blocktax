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
import UIStore from './stores/ui';
import TransactionsStore from './stores/transactions';
import './style.css';

const router = new RouterStore();
const blockstack = new BlockstackStore(router);
const transactions = new TransactionsStore();
const ui = new UIStore(blockstack, transactions);
const history = syncHistoryWithStore(createBrowserHistory(), router);

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


// const tranasactionsRequired = Screen => props => {
//   console.log(blockstack.transactions)
//   if(isUserSignedIn()) {
//     return <Screen {...props}/>
//   } else {
//     return <Redirect to="/"/>
//   }
// };

const App = () => (
  <Router history={history} basename={process.env.PUBLIC_URL}>
    <AsyncProvider stores={{blockstack, ui, transactions, router}}>
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
