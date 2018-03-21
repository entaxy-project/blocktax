/* eslint-disable camelcase */

import {observable, computed, action} from 'mobx';
import {persist} from 'mobx-persist';
import uuid from 'uuid/v4';
import queryString from 'query-string';
import getTime from 'date-fns/get_time';
import createTaxEvents from '../utils/create-tax-events';

const redirectUri = `${process.env.BASE_URL}/auth`;

export default class CoinbaseStore {
  static persist = true

  @persist
  @observable
  oauthState = null

  @persist
  @observable
  accessToken = null

  @persist
  @observable
  refreshToken = null

  @persist
  @observable
  userId = null

  @persist('map')
  @observable
  accounts = new Map()

  @persist('list')
  @observable
  transactions = []

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

    return createTaxEvents(groupedTransactions);
  }

  filterTransactionsBy(types) {
    return this.transactions.filter(t => types.includes(t.type)).sort(this.sortTransactions);
  }

  sortTransactions(a, b) {
    return getTime(b.created_at) - getTime(a.created_at);
  }

  @computed
  get buyAndSellTransactions() {
    return this.filterTransactionsBy(['buy', 'sell']);
  }

  @computed
  get signedIn() {
    return this.userId !== null;
  }

  signIn = () => {
    this.oauthState = uuid();

    const params = {
      response_type: 'code',
      client_id: process.env.COINBASE_API_ID,
      redirect_uri: redirectUri,
      state: this.oauthState,
      scope: ['wallet:accounts:read', 'wallet:transactions:read'].join(','),
      account: 'all'
    };

    setTimeout(() => {
      window.location = `https://www.coinbase.com/oauth/authorize?${queryString.stringify(params)}`;
    }, 1000);
  }

  @action.bound
  async signOut() {
    const params = {
      token: this.accessToken,
      access_token: this.accessToken
    };
    await fetch('https://api.coinbase.com/oauth/revoke', {
      method: 'post',
      mode: 'no-cors',
      body: new URLSearchParams(queryString.stringify(params))
    });

    this.resetState();
  }

  resetState() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;
    this.accounts.clear();
    this.transactions.clear();
  }

  getAuthToken = async input => {
    const {code, state} = queryString.parse(input);

    if (state === this.oauthState) {
      const params = {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.COINBASE_API_ID,
        client_secret: process.env.COINBASE_API_SECRET,
        redirect_uri: redirectUri
      };
      const response = await fetch('https://api.coinbase.com/oauth/token', {
        method: 'post',
        body: new URLSearchParams(queryString.stringify(params))
      });

      if (!response.ok) {
        throw new Error('The OAuth token request was done incorrectly.');
      }

      const json = await response.json();

      this.accessToken = json.access_token;
      this.refreshToken = json.refresh_token;
      this.oauthState = null;

      await this.fetchUserId();
      await this.fetchTransactions();
    } else {
      throw new Error('State returned from Coinbase did not match the one sent.');
    }
  }

  async makeApiCall(path, params = null, returnResponse = false) {
    try {
      const query = params ? `?${queryString.stringify(params)}` : '';
      const response = await fetch(`https://api.coinbase.com/v2/${path}${query}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'CB-VERSION': '2018-03-10'
        }
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      if (returnResponse) {
        return response;
      }

      return response.json();
    } catch (err) {
      console.log(err);
      throw new Error(`Could not fetch resource /${path} from Coinbase.`);
    }
  }

  @action
  async fetchUserId() {
    const json = await this.makeApiCall('user');

    this.userId = json.data.id;
  }

  @action
  async fetchAccounts() {
    const json = await this.makeApiCall('accounts');

    this.accounts.replace(json.data.map(account => [account.id, {currency: account.currency}]));
  }

  @action.bound
  async fetchTransactions() {
    if (this.accounts.size === 0) {
      await this.fetchAccounts();
    }

    this.transactions.clear();

    await Promise.all([...this.accounts].map(async ([id]) => {
      const query = async (url, params) => {
        const response = await this.makeApiCall(url, params, true);
        const json = await response.json();

        json.data.forEach(t => this.transactions.push(t));

        if (json.pagination.next_uri) {
          return query(json.pagination.next_uri.replace(/^\/v2\//, ''), null);
        }
      };

      await query(`accounts/${id}/transactions`, {limit: 50});
    }));
  }
}
