import {observable, computed, action} from 'mobx';
import {persist} from 'mobx-persist';

export default class UIStore {
  static persist = true

  constructor(blockstack, transactions) {
    this.blockstack = blockstack;
    this.transactions = transactions;
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
    return Math.ceil(this.transactions.buyAndSellTransactions.length / this.dashboardPageSize);
  }

  @computed
  get dashboardTransactions() {
    const start = this.dashboardPage * this.dashboardPageSize;
    const end = start + this.dashboardPageSize;

    return this.transactions.buyAndSellTransactions.slice(start, end);
  }

  @action.bound
  changeDashboardPage(n) {
    this.dashboardPage = n;
  }

  @action.bound
  resetState() {
    this.disclaimerIsVisible = true;
    this.transactions.transactions.clear();
  }
}
