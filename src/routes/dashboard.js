import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Header from '../components/header';
import Body from '../components/body';
import Import from '../components/import';
import TransactionList from '../components/transaction-list';
import TaxEventList from '../components/tax-event-list';
import DashboardState from '../constants/dashboard-state';

const injector = stores => ({
  state: stores.ui.dashboardState,
  showTaxes: stores.ui.showTaxes
});

const Dashboard = ({state, showTaxes}) => (
  <div className="panel-welcome" id="section-2">
    <Header/>
    <Body>
      {state === DashboardState.NoLinkedAccounts && <Import/>}
      {state !== DashboardState.NoLinkedAccounts && !showTaxes && <TransactionList/>}
      {state !== DashboardState.NoLinkedAccounts && showTaxes && <TaxEventList/>}
    </Body>
  </div>
);

Dashboard.propTypes = {
  state: PropTypes.oneOf(Object.values(DashboardState)).isRequired,
  showTaxes: PropTypes.bool.isRequired
};

export default inject(injector)(Dashboard);
