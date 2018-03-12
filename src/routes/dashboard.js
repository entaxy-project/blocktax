import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Header from '../components/header';
import Body from '../components/body';
import ConnectExchange from '../components/connect-exchange';
import TransactionList from '../components/transaction-list';
import DashboardState from '../constants/dashboard-state';

const injector = stores => ({
  state: stores.ui.dashboardState
});

const Dashboard = ({state}) => (
  <div className="panel-welcome" id="section-2">
    <Header/>
    <Body>
      {state === DashboardState.NoLinkedAccounts && <ConnectExchange/>}
      {state !== DashboardState.NoLinkedAccounts && <TransactionList/>}
    </Body>
  </div>
);

Dashboard.propTypes = {
  state: PropTypes.oneOf(Object.values(DashboardState)).isRequired
};

export default inject(injector)(Dashboard);
