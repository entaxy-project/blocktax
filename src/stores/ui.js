import {observable, computed, action} from 'mobx';
import DashboardState from '../constants/dashboard-state';

export default class UIStore {
  constructor(blockstack, coinbase) {
    this.blockstack = blockstack;
    this.coinbase = coinbase;
  }

  @observable
  dashboardPage = 0

  dashboardPageSize = 10

  @observable
  showTaxes = false

  @action.bound
  toggleShowTaxes() {
    this.showTaxes = !this.showTaxes;
  }

  @computed
  get dashboardPageCount() {
    return Math.ceil(this.coinbase.buyAndSellTransactions.length / this.dashboardPageSize);
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
      [DashboardState.TransactionsReady]: 'Here\'s your complete transaction history'
    }[this.dashboardState];
  }

  @computed
  get dashboardTransactions() {
    const start = this.dashboardPage * this.dashboardPageSize;
    const end = start + this.dashboardPageSize;

    return this.coinbase.buyAndSellTransactions.slice(start, end);
  }

  @action.bound
  changeDashboardPage(n) {
    this.dashboardPage = n;
  }
}
