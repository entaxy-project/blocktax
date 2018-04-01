/* eslint-disable camelcase */

import {observable, computed, action} from 'mobx';
import {persist} from 'mobx-persist';
import getTime from 'date-fns/get_time';
import importTransactionsFromCoinbase from 'utils/import/coinbase';
import format from 'date-fns/format';
import createTaxEvents from '../utils/create-tax-events';
import Big from 'big.js';
import formatCurrency from 'utils/format-currency';

export default class TransactionsStore {
  static persist = true

  @persist('list')
  @observable
  transactions = []

  @persist('list')
  @observable
  gains = []

  @action.bound
  clearTransactions() {
    this.gains.clear();
    this.transactions.clear();
  }

  @action.bound
  async importTransactionsFrom(source, apiKey, apiSecret) {

    // Each import function shold return a hash with the following keys:
    // {string} source - where the transaction was imported from
    // {string} date
    // {string} type
    // {string} title
    // {string} description
    // {Big}    units
    // {string} unitCurrency
    // {Big}    fiatAmount
    // {string} fiatCurrency
    // {Big}    pricePerUnit
    const importFromSource = {
      coinbase: importTransactionsFromCoinbase
    };
    this.clearTransactions();
    this.transactions = await importFromSource[source](apiKey, apiSecret);
    this.gains = this.calculateCapitalGains();
  }

  @computed
  get exist() {
    return this.transactions.length > 0;
  }

  @computed
  get all() {
    return this.filterBy('all').sort(this.sortTransactions);
  }

  @computed
  get buys() {
    return this.filterBy('buys').sort(this.sortTransactions);
  }

  @computed
  get sells() {
    return this.filterBy('sells').sort(this.sortTransactions);
  }

  // Group the transactions by currency + buys and sells
  // Returns an array of capital gains
  calculateCapitalGains() {
    const groupedTransactions = {};

    for (let t = 0; t < this.transactions.length; t++) {
      const transaction = this.transactions[t];
      const transactionType = transaction.type === 'buy' ? 'buys' : 'sells';

      if (!(transaction.unitCurrency in groupedTransactions)) {
        groupedTransactions[transaction.unitCurrency] = {buys: [], sells: []};
      }

      // Group the transactions by currency and by buy/sell type
      groupedTransactions[transaction.unitCurrency][transactionType].push({
        created_at: transaction.created_at,
        amount: new Big(Math.abs(parseFloat(transaction.units))),
        native_amount: new Big(Math.abs(parseFloat(transaction.fiatAmount))),
        native_currency: transaction.fiatCurrency,
        unit_price: new Big(transaction.pricePerUnit)
      });
    }

    return createTaxEvents(groupedTransactions);
  }

  @computed
  get totalGainsMessage() {
    const reducer = (sum, event) => sum.add(event.gain);
    const totalGains = this.gains.reduce(reducer, new Big(0));

    if (totalGains.gt(0)) {
      return `a total gain of ${formatCurrency(totalGains, 'USD')}`;
    }
    if (totalGains.lt(0)) {
      return `a total loss of (${formatCurrency(Math.abs(totalGains), 'USD')})`;
    }
    return `no gains`;
  }

  @computed
  get gainsForCsv() {
    return this.gains.map(event => (
      {
        units_transacted: event.units_transacted,
        source_currency: event.source_currency,
        destination_currency: event.destination_currency,
        sell_date: format(event.sell_date, 'MM/DD/YYYY h:mma'),
        sell_total_price: event.sell_total_price,
        sell_price_per_unit: event.sell_price_per_unit,
        buy_date: format(event.buy_date, 'MM/DD/YYYY h:mma'),
        buy_total_price: event.buy_total_price,
        buy_price_per_unit: event.buy_price_per_unit,
        gain: event.gain,
        shortTerm: event.shortTerm ? 'Yes' : 'No'
      })
    );
  }

  filterBy(filter) {
    const transactionTypes = {
      all: ['buy', 'sell'],
      buys: ['buy'],
      sells: ['sell'],
    }[filter] || ['buy', 'sell'];
    return this.transactions.filter(t => transactionTypes.includes(t.type));
  }

  sortTransactions(a, b) {
    return getTime(b.date) - getTime(a.date);
  }
}
