/* eslint-disable camelcase */

import {observable, computed, action} from 'mobx';
import {persist} from 'mobx-persist';
import getTime from 'date-fns/get_time';
import importTransactionsFromCoinbase from 'utils/import/coinbase';
import parseDate from 'date-fns/parse';
import formatDate from 'date-fns/format';
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

  // An empty query returns all items
  @persist('object')
  @observable
  query = {
    transactions: {},
    gains: {}
  }

  @persist('object')
  @observable
  searcheableAttributes = {}

  @action.bound
  clearTransactions() {
    this.gains.clear();
    this.transactions.clear();
  }

  @action.bound
  setQuery(type, query) {
    this.query[type] = query;
  }

  @action.bound
  async importTransactionsFrom(source, apiKey, apiSecret) {
    // Each import function should return a hash with the following keys:
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

    // Collect attributes for gains
    this.searcheableAttributes = {
      transactions: {
        years: new Set(),
        currencies: new Set()
      },
      gains: {
        years: new Set(),
        currencies: new Set(),
        term: ['short', 'long']
      }
    }
    for (let i = 0; i< this.transactions.length; i++) {
      this.searcheableAttributes.transactions.years.add(parseDate(this.transactions[i].date).getFullYear());
      this.searcheableAttributes.transactions.currencies.add(this.transactions[i].unitCurrency);
    }
    for (let i = 0; i< this.gains.length; i++) {
      this.searcheableAttributes.gains.years.add(parseDate(this.gains[i].sell_date).getFullYear());
      this.searcheableAttributes.gains.currencies.add(this.gains[i].source_currency);
    }
    console.log('searcheableAttributes: ', this.searcheableAttributes)
  }

  @computed
  get exist() {
    return this.transactions.length > 0;
  }

  @computed
  get transactionList() {
    return this.filterTransactions().sort(this.sortTransactions);
  }

  @computed
  get gainsList() {
    return this.filterGains().sort(this.sortGains);
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
  get gainsYears() {
    let years = new Set();
    for (let i = 0; i< this.gains.length; i++) {
      years.add(parseDate(this.gains[i].sell_date).getFullYear());
    }
    return years;
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
        sell_date: formatDate(event.sell_date, 'MM/DD/YYYY h:mma'),
        sell_total_price: event.sell_total_price,
        sell_price_per_unit: event.sell_price_per_unit,
        buy_date: formatDate(event.buy_date, 'MM/DD/YYYY h:mma'),
        buy_total_price: event.buy_total_price,
        buy_price_per_unit: event.buy_price_per_unit,
        gain: event.gain,
        shortTerm: event.shortTerm ? 'Yes' : 'No'
      })
    );
  }

  filterBy(item, query, filters) {
    let result = true;
    for (const key of Object.keys(query)) {
      result &= filters[key](query[key], item);
    }
    return result;
  }

  filterTransactions() {
    const filters = {
      year: (year, item) => parseDate(item.date).getFullYear() === year,
      type: (types, item) => types.includes(item.type),
      currency: (currencies, item) => currencies.includes(item.unitCurrency)
    };
    return this.transactions.filter(transaction => this.filterBy(transaction, this.query.transactions, filters));
  }

  filterGains() {
    const filters = {
      year: (year, item) => parseDate(item.sell_date).getFullYear() === year,
      term: (terms, item) => terms.include(item.shortTerm ? 'short' : 'long')
    };
    return this.gains.filter(gain => this.filterBy(gain, this.query.gains, filters));
  }

  sortTransactions(a, b) {
    return getTime(b.date) - getTime(a.date);
  }

  sortGains(a, b) {
    if (getTime(b.sell_date) === getTime(a.sell_date)) {
      return getTime(b.buy_date) - getTime(a.buy_date);
    }
    return getTime(b.sell_date) - getTime(a.sell_date);
  }
}
