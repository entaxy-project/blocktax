import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import TaxEventList from '../components/tax-event-list';
import Header from '../components/header';
import Body from '../components/body';
import Card from '../components/card';
import ConnectExchange from '../components/connect-exchange';
import DashboardState from '../constants/dashboard-state';

const injector = stores => ({
  events: toJS(stores.coinbase.taxEvents),
  fetchCoinbaseTransactions: stores.coinbase.fetchTransactions,
  signedInToCoinbase: stores.coinbase.signedIn,
  signOutOfCoinbase: stores.coinbase.signOut,
  signOutOfBlockstack: stores.blockstack.signOut,
  state: stores.ui.dashboardState
});

const Dashboard = ({history, signedInToCoinbase, signOutOfCoinbase, signOutOfBlockstack, fetchCoinbaseTransactions, state}) => (
  <div className="panel-welcome" id="section-2">
    <Header/>
    <Body>
      <Card>
        <ConnectExchange/>
      </Card>
      {/* {signedInToCoinbase && (
        <button
          className="btn btn-primary btn-lg"
          id="signout-button"
          onClick={fetchCoinbaseTransactions}
          type="button"
        >
          Get Coinbase Transactions
        </button>
      )} */}
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
      <button
        className="btn btn-primary btn-lg"
        id="signout-button"
        onClick={signOutOfBlockstack}
        type="button"
      >
        Logout
      </button>
      <TaxEventList/>
    </Body>
  </div>
);

Dashboard.propTypes = {
  fetchCoinbaseTransactions: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  signedInToCoinbase: PropTypes.bool.isRequired,
  signOutOfCoinbase: PropTypes.func.isRequired,
  signOutOfBlockstack: PropTypes.func.isRequired,
  state: PropTypes.oneOf(Object.values(DashboardState)).isRequired
};

export default inject(injector)(Dashboard);
