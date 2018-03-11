import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import TransactionList from '../components/transaction-list';
import TaxEventList from '../components/tax-event-list';
import Header from '../components/header';
import Body from '../components/body';
import Card from '../components/card';

const injector = stores => ({
  name: stores.blockstack.name,
  avatar: stores.blockstack.avatar,
  events: toJS(stores.coinbase.taxEvents),
  fetchCoinbaseTransactions: stores.coinbase.fetchTransactions,
  signedInToCoinbase: stores.coinbase.signedIn,
  signOutOfCoinbase: stores.coinbase.signOut,
  signOutOfBlockstack: stores.blockstack.signOut,
  signInWithCoinbase: stores.coinbase.signIn,
  transactions: toJS(stores.coinbase.transactions)
});

const Dashboard = ({name, avatar, history, signedInToCoinbase, signOutOfCoinbase, signOutOfBlockstack, signInWithCoinbase, fetchCoinbaseTransactions, transactions, events}) => (
  <div className="panel-welcome" id="section-2">
    <Header/>
    <Body>
      <Card>
        <div className="avatar-section">
          <img src={avatar} className="img-rounded avatar" id="avatar-image"/>
        </div>
        <h1>Hello, <span id="heading-name">{name}</span>!</h1>
        {signedInToCoinbase && (
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={fetchCoinbaseTransactions}
            type="button"
          >
            Get Coinbase Transactions
          </button>
        )}
        {/* {signedInToCoinbase && (
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={signOutOfCoinbase}
            type="button"
          >
            Sign Out of Coinbase
          </button>
        )} */}
        {!signedInToCoinbase && (
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={signInWithCoinbase}
            type="button"
          >
            Sign In with Coinbase
          </button>
        )}
        <button
          className="btn btn-primary btn-lg"
          id="signout-button"
          onClick={() => {
            signOutOfBlockstack();
            history.push('/'); // @TODO Move this line to Blockstack store
          }}
          type="button"
        >
          Logout
        </button>
        {transactions.length > 0 && (
          <div>
            <div>
              <TransactionList transactions={transactions}/>
            </div>
            <div>
              <TaxEventList events={events}/>
            </div>
          </div>
        )}
      </Card>
    </Body>
  </div>
);

Dashboard.propTypes = {
  avatar: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchCoinbaseTransactions: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  signedInToCoinbase: PropTypes.bool.isRequired,
  signOutOfCoinbase: PropTypes.func.isRequired,
  signOutOfBlockstack: PropTypes.func.isRequired,
  signInWithCoinbase: PropTypes.func.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default inject(injector)(Dashboard);
