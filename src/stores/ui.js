import {computed} from 'mobx';
import DashboardState from '../constants/dashboard-state';

export default class UIStore {
  constructor(blockstack, coinbase) {
    this.blockstack = blockstack;
    this.coinbase = coinbase;
  }

  @computed
  get dashboardState() {
    if (!this.coinbase.signedIn) {
      return DashboardState.NoLinkedAccounts;
    }

    if (this.coinbase.transactions.length === 0) {
      return DashboardState.TransactionsLoading;
    }

    return DashboardState.TransactionsReady;
  }

  @computed
  get dashboardText() {
    return {
      [DashboardState.NoLinkedAccounts]: 'Connect with your wallet to get started',
      [DashboardState.TransactionsLoading]: 'Your data is being imported',
      [DashboardState.TransactionsReady]: 'In 2017, you had a total loss of ($4,000) from 500 transactions in Coinbase using the FIFO method.'
    }[this.dashboardState];
  }
}
