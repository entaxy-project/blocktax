import crypto from 'crypto';
import queryString from 'query-string';
import Big from 'big.js';
import uuid from 'uuid/v4';

const baseUrl = 'https://api.coinbase.com';
const apiVersion = 'v2';
const apiVersionDate = '2015-07-22';


/**
 * Signs the request used to retreive data from an API endpoint
 * @param {string} apiSecret - The users api secret
 * @param {string} resource - The name of the API resource
 * @param {number} timestamp - The current unix time in seconds
 * @returns {Array} signature - A signed request
 */
const getSignature = (apiSecret, resource, timestamp) => {
  // Set the parameter for the request message
  const req = {method: 'GET', path: `/${apiVersion}/${resource}`, body: ''};

  // Create a hexedecimal encoded SHA256 signature of the message
  const message = timestamp + req.method + req.path + req.body;
  return crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
};

/**
 * Imports data from the provided API resource
 * @param {string} apiKey - The users coinbase api key
 * @param {string} apiSecret - The users api secret
 * @param {string} resource - The name of the API resource
 * @param {string} params - Aany params to be attached to the API resource
 * @param {number} timestamp - The current unix time in seconds
 * @returns {Array} signature - A signed request
 */
const getDataFrom = async (apiKey, apiSecret, resource, params = null) => {
  const timestamp = Math.floor(Date.now() / 1000); // Get unix time in seconds
  resource += params ? `?${queryString.stringify(params)}` : '';
  const url = `${baseUrl}/${apiVersion}/${resource}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'CB-ACCESS-SIGN': getSignature(apiSecret, resource, timestamp),
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-KEY': apiKey,
      'CB-VERSION': apiVersionDate
    }
  });

  if (!response.ok) {
    const message = {
      401: '401 Unauthorized. Please make sure you entered the API key correctly and that it has the right permissions',
    }[response.status];
    console.log(response);
    throw new Error(message);
  }

  return response.json();
};

/**
 * Imports data from the provided API resource
 * @param {string} apiKey - The users coinbase api key
 * @param {string} apiSecret - The users api secret
 * @param {string} resource - The name of the API resource
 * @param {string} params - Aany params to be attached to the API resource
 * @param {number} timestamp - The current unix time in seconds
 * @returns {Array} signature - A signed request
 */
const getPaginatedDataFrom = async (apiKey, apiSecret, url, params, transactions) => {
  const response = await getDataFrom(apiKey, apiSecret, url, params);

  response.data.forEach(t => transactions.push(t));

  if (response.pagination.next_uri) {
    return getPaginatedDataFrom(apiKey, apiSecret, response.pagination.next_uri.replace(/^\/v2\//, ''), null, transactions);
  }
};

const normalizeData = transactions => {
  let normalizedTransactions = [];

  for (let t = 0; t < transactions.length; t++) {
    const transaction = transactions[t];

    // Only care about completed transactions that were bought or sold
    if (transaction.status !== 'completed' || !['buy', 'sell'].includes(transaction.type) || transaction.amount.currency === 'USD') {
      continue;
    }

    // Group the transactions by currency and by buy/sell type
    const units = new Big(Math.abs(parseFloat(transaction.amount.amount)));
    const fiatAmount = new Big(Math.abs(parseFloat(transaction.native_amount.amount)));

    normalizedTransactions.push({
      id: uuid(),
      source: 'coinbase',
      date: transaction.created_at,
      type: transaction.type,
      title: transaction.details.title,
      description: transaction.details.subtitle,
      units,
      unitCurrency: transaction.amount.currency,
      fiatAmount,
      fiatCurrency: transaction.native_amount.currency,
      pricePerUnit: Math.abs(fiatAmount.div(units))
    });
  }

  return normalizedTransactions;
}

/**
 * Import the full list of transactions from coinbase
 * @param {string} apiKey - The users coinbase api key
 * @param {string} apiSecret - The users coinbase api secret
 * @returns {transactions[]} List of transactions.
 */
export default async (apiKey, apiSecret) => {
  const transactions = [];

  // Grab all the accounts
  // [{id: "bf999c72-b2d7-5158-a449-3aa46755f49d", name: "BCT Wallet", currency: "BCH", ...}, {...}]
  const accounts = await getDataFrom(apiKey, apiSecret, 'accounts');

  // Grab the transactions from each of the accounts
  await Promise.all(accounts.data.map(async account => {
    await getPaginatedDataFrom(apiKey, apiSecret, `accounts/${account.id}/transactions`, {limit: 100}, transactions);
  }));

  return normalizeData(transactions);
};
