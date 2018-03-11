/* eslint-disable camelcase */

import {observable, computed, action, toJS} from 'mobx';
import {persist} from 'mobx-persist';
import uuid from 'uuid/v4';
import queryString from 'query-string';
import flatten from 'arr-flatten';
import createTransactionHistory from '../utils/create-transaction-history';

const redirectUri = `${process.env.BASE_URL}/auth`;

export default class CoinbaseStore {
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
    return createTransactionHistory(toJS(this.transactions));
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
      scope: ['wallet:accounts:read', 'wallet:transactions:read'].join(',')
    };

    window.location = `https://www.coinbase.com/oauth/authorize?${queryString.stringify(params)}`;
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

      await this.fetchUserId();
      await this.fetchTransactions();
    } else {
      throw new Error('State returned from Coinbase did not match the one sent.');
    }
  }

  async makeApiCall(path) {
    try {
      const response = await fetch(`https://api.coinbase.com/v2/${path}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'CB-VERSION': '2018-03-10'
        }
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    } catch (err) {
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
    await this.fetchAccounts();

    const data = await Promise.all([...this.accounts].map(async ([id]) => {
      const json = await this.makeApiCall(`accounts/${id}/transactions`);

      return json.data;
    }));
    const transactions = flatten(data);

    this.transactions.replace(transactions);
  }
}
