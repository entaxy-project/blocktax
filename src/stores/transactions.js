/* eslint-disable camelcase */

import {observable, computed, action, toJS} from 'mobx';
import {persist} from 'mobx-persist';
import getTime from 'date-fns/get_time';
import importTransactionsFromCoinbase from 'utils/import/coinbase';
import format from 'date-fns/format';
import createTaxEvents from '../utils/create-tax-events';
import Big from 'big.js';
import getLocale from 'utils/get-locale';

export default class TransactionsStore {
  static persist = true

  @persist('list')
  @observable
  transactions = []

  @action.bound
  clearTransactions() {
    return this.transactions.clear();
  }

  @action.bound
  async importTransactionsFrom(source, apiKey, apiSecret) {
    const importSources = {
      coinbase: importTransactionsFromCoinbase
    };
    this.clearTransactions();
    this.transactions = toJS(await importSources[source](apiKey, apiSecret));
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
      const amount = new Big(Math.abs(parseFloat(transaction.amount.amount)));
      const native_amount = new Big(Math.abs(parseFloat(transaction.native_amount.amount)));
      groupedTransactions[transaction.amount.currency][transactionType].push({
        created_at: transaction.created_at,
        amount,
        native_amount,
        native_currency: transaction.native_amount.currency,
        unit_price: native_amount.div(amount)
      });
    }

    return createTaxEvents(groupedTransactions).sort((a, b) => {
      if (getTime(b.created_at) === getTime(a.created_at)) {
        return getTime(b.sell_date) - getTime(a.sell_date);
      }
      return getTime(b.buy_date) - getTime(a.buy_date);
    });
  }

  formattedAmount(amount, currency) {
    if (['BTC', 'BCC', 'ETH', 'LTC'].includes(currency)) {
      return `${amount.toFixed()} ${currency}`;
    }
    return parseFloat(amount).toLocaleString(getLocale(), {
      style: 'currency',
      currency
    });
  }

  @computed
  get totalGainsMessage() {
    const reducer = (sum, event) => sum.add(event.gain);
    const totalGains = this.taxEvents.reduce(reducer, new Big(0));

    if (totalGains.gt(0)) {
      return `a total gain of ${this.formattedAmount(totalGains, 'USD')}`;
    }
    if (totalGains.lt(0)) {
      return `a total loss of (${this.formattedAmount(Math.abs(totalGains), 'USD')})`;
    }
    return `no gains`;
  }

  @computed
  get taxEventsForCsv() {
    return this.taxEvents.map(event => (
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

  filterTransactionsBy(types) {
    return this.transactions.filter(t => types.includes(t.type)).sort(this.sortTransactions);
  }

  sortTransactions(a, b) {
    return getTime(b.created_at) - getTime(a.created_at);
  }
}
