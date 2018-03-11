import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import {signUserOut} from 'blockstack';
import TransactionList from '../components/transaction-list';
import TaxEventList from '../components/tax-event-list';
import withPerson from '../utils/with-person';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const injector = stores => ({
  events: toJS(stores.store.taxEvents),
  fetchCoinbaseTransactions: stores.store.fetchTransactions,
  signedInToCoinbase: stores.store.signedIn,
  signInWithCoinbase: stores.store.signIn,
  transactions: toJS(stores.store.transactions)
});

const Dashboard = ({person, history, signedInToCoinbase, signInWithCoinbase, fetchCoinbaseTransactions, transactions, events}) => (
  <div className="panel-welcome" id="section-2">
    <div className="avatar-section">
      <img src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage} className="img-rounded avatar" id="avatar-image"/>
    </div>
    <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
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
    {!signedInToCoinbase && (
      <button
        className="btn btn-primary btn-lg"
        id="signout-button"
        onClick={signInWithCoinbase}
        type="button"
      >
        Sign in with Coinbase
      </button>
    )}
    <button
      className="btn btn-primary btn-lg"
      id="signout-button"
      onClick={() => {
        signUserOut();
        history.push('/');
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
  </div>
);

Dashboard.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchCoinbaseTransactions: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  signedInToCoinbase: PropTypes.bool.isRequired,
  signInWithCoinbase: PropTypes.func.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withPerson(inject(injector)(Dashboard));
