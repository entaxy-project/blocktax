import {observable, computed, action} from 'mobx';
import {persist} from 'mobx-persist';
import DashboardState from '../constants/dashboard-state';

export default class UIStore {
  static persist = true

  constructor(blockstack, coinbase) {
    this.blockstack = blockstack;
    this.coinbase = coinbase;
  }

  @observable
  dashboardPage = 0

  dashboardPageSize = 10

  @persist
  @observable
  disclaimerIsVisible = true

  @action.bound
  hideDisclaimer() {
    this.disclaimerIsVisible = false;
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
