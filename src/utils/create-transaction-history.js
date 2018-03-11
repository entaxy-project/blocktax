import uuid from 'uuid/v4';

const exampleEvent = {
  date: Date.now(),
  amount: {
    amount: 2,
    currency: 'BTC'
  },
  proceeds: {
    amount: {
      amount: 24000,
      currency: 'USD'
    },
    pricePer: {
      amount: 12000,
      currency: 'BTC'
    }
  },
  cost: {
    amount: {
      amount: 16000,
      currency: 'USD'
    },
    pricePer: {
      amount: 8000,
      currency: 'BTC'
    }
  },
  gain: {
    amount: 8000,
    currency: 'USD'
  }
};

/**
 * Convert a raw list of transactions from Coinbase into a series of tax events, including cost
 * basis and gain/loss.
 * @param {Object[]} transactions - Transaction list.
 * @returns {TaxEvent[]} List of tax events.
 */
export default () => {
  return new Array(10).fill(Object.assign({id: uuid()}, exampleEvent));
};

/**
 * @typedef {Object} TaxEvent
 * @prop {String} id - Unique ID for event.
 * @prop {String} date - Date of event.
 * @prop {Amount} amount - Amount sold.
 * @prop {Object} proceeds - Revenue from sale.
 * @prop {Amount} proceeds.amount - Crypto revenue from sale.
 * @prop {Amount} proceeds.pricePer - Fiat value per coin at time of sale.
 * @prop {Object} cost - Cost basis of sale.
 * @prop {Amount} cost.amount - Crypto cost basis of sale.
 * @prop {Amount} cost.pricePer - Fiat value per coin at time of purchase.
 * @prop {Amount} gain - Fiat gain/loss from sale.
 */

/**
 * @typedef {Object} Amount
 * @prop {Number} amount - Quantity of currency.
 * @prop {String} currency - Type of currency.
 */
