import React from 'react';
import ReactDOM from 'react-dom';
import AuthHandler from './components/auth-handler';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import AsyncProvider from './components/async-provider';
import Routes from './routes'
import BlockstackStore from './stores/blockstack';
import UIStore from './stores/ui';
import TransactionsStore from './stores/transactions';
import createBrowserHistory from 'history/createBrowserHistory';
import './style.css';

const router = new RouterStore();
const blockstack = new BlockstackStore(router);
const transactions = new TransactionsStore();
const ui = new UIStore(blockstack, transactions);
const history = syncHistoryWithStore(createBrowserHistory(), router);


const App = () => (
  <AsyncProvider stores={{blockstack, ui, transactions, router}}>
	  <AuthHandler>
	    <Routes history={history}/>
	  </AuthHandler>
  </AsyncProvider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
