import {observable, computed, action, toJS} from 'mobx';
import {persist} from 'mobx-persist';
import getTime from 'date-fns/get_time';
import importTransactionsFromCoinbase from 'utils/import/coinbase'
import createTaxEvents from '../utils/create-tax-events';

export default class TransactionsStore {
  static persist = true

  @persist('list')
  @observable
  transactions = []

  // @persist
  @observable
  apiKey = '';

  // @persist
  @observable
  apiSecret = '';

  @action.bound
  clearTransactions() {
    return this.transactions.clear();
  }

  @action.bound
  async importTransactionsFrom(source, apiKey, apiSecret) {
    const importSources = {
      coinbase: importTransactionsFromCoinbase
    }
    this.clearTransactions()
    this.transactions = toJS(await importSources[source](apiKey, apiSecret))
  }

  @computed
  get exist() {
    return this.buyAndSellTransactions.length > 0;
  }

  @computed
  get buyAndSellTransactions() {
    return this.filterTransactionsBy(['buy', 'sell']);
  }

  @computed
  get taxEvents() {
    const groupedTransactions = {};

    for (let t = 0; t < this.transactions.length; t++) {
      const transaction = this.transactions[t];
      const transactionType = transaction.type === 'buy' ? 'buys' : 'sells';

      // Only calculate gains for completed transactions between buys and sells
      if (transaction.status !== 'completed' || !['buy', 'sell'].includes(transaction.type) || transaction.amount.currency === 'USD') {
        continue;
      }

      if (!(transaction.amount.currency in groupedTransactions)) {
        groupedTransactions[transaction.amount.currency] = {buys: [], sells: []};
      }

      // Group the transactions by currency and by buy/sell type
      groupedTransactions[transaction.amount.currency][transactionType].push({
        created_at: transaction.created_at,
        amount: Math.abs(parseFloat(transaction.amount.amount)),
        native_amount: Math.abs(parseFloat(transaction.native_amount.amount)),
        native_currency: transaction.native_amount.currency,
        unit_price: Math.abs(parseFloat(transaction.native_amount.amount) / parseFloat(transaction.amount.amount))
      });
    }

    return createTaxEvents(groupedTransactions).sort(this.sortTransactions);
  }

  @computed
  get taxEventsForCsv() {
    return this.taxEvents;
  }

  filterTransactionsBy(types) {
    return this.transactions.filter(t => types.includes(t.type)).sort(this.sortTransactions);
  }

  sortTransactions(a, b) {
    return getTime(b.created_at) - getTime(a.created_at);
  }
}
