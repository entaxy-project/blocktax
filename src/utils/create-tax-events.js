/* eslint-disable camelcase */

import uuid from 'uuid/v4';
import difference_in_days from 'date-fns/difference_in_days';

const calculateGainsWithFIFO = (buys, sells, currency) => {
  const taxEvents = [];
  const ONE_YEAR = 365; //days
  let buy;
  let sell;
  let created_at;
  let sell_amount;
  let sell_price_per_unit;
  let sell_native_amount;
  let fiat_currency;
  let buy_price_per_unit;
  let cost;
  let shortTerm;

  while (sells.length > 0) {
    if (sells[0].amount > buys[0].amount) {
      buy = buys.shift();
      sells[0].amount -= buy.amount;
      created_at = sells[0].created_at;
      // Amount
      sell_amount = buy.amount;
      // Proceeds
      sell_price_per_unit = sells[0].unit_price;
      sell_native_amount = sell_amount * sell_price_per_unit;
      fiat_currency = sells[0].native_currency;
      // Cost
      buy_price_per_unit = buy.unit_price;
      cost = buy.amount * buy_price_per_unit;
      shortTerm = difference_in_days(sells[0].created_at, buy.created_at) <= ONE_YEAR;
    } else if (sells[0].amount < buys[0].amount) {
      sell = sells.shift();
      buys[0].amount -= sell.amount;
      created_at = sell.created_at;
      // Amount
      sell_amount = sell.amount;
      // Proceeds
      sell_price_per_unit = sell.unit_price;
      sell_native_amount = buys[0].amount * sell_price_per_unit;
      fiat_currency = sell.native_currency;
      // Cost
      buy_price_per_unit = buys[0].unit_price;
      cost = sell_amount * buy_price_per_unit;
      shortTerm = difference_in_days(sell.created_at, buys[0].created_at) <= ONE_YEAR;
    } else {
      buy = buys.shift();
      sell = sells.shift();
      created_at = sell.created_at;
      // Amount
      sell_amount = sell.amount;
      // Proceeds
      sell_price_per_unit = sell.unit_price;
      sell_native_amount = sell.native_amount;
      fiat_currency = sell.native_currency;
      // Cost
      buy_price_per_unit = buy.unit_price;
      cost = sell_amount * buy_price_per_unit;
      shortTerm = difference_in_days(sell.created_at, buy.created_at) <= ONE_YEAR;
    }
    taxEvents.push({
      id: uuid(),
      created_at,
      amount: {
        amount: sell_amount,
        currency
      },
      cost: {
        amount: {
          amount: cost,
          currency: fiat_currency
        },
        pricePer: {
          amount: buy_price_per_unit,
          currency
        }
      },
      proceeds: {
        amount: {
          amount: sell_native_amount,
          currency: fiat_currency
        },
        pricePer: {
          amount: sell_price_per_unit,
          currency
        }
      },
      gain: {
        amount: sell_native_amount - cost,
        currency: fiat_currency
      },
      shortTerm
    });
  }
  return taxEvents;
};

/**
 * Convert a raw list of transactions from Coinbase into a series of tax events, including cost
 * basis and gain/loss.
 * @param {Object[]} transactions - Transaction list.
 * @returns {TaxEvent[]} List of tax events.
 */
export default transactions => {
  let taxEvents = [];
  // transactions = {
  //   ETH: {
  //     buys: [
  //       {
  //         created_at: Date.parse('01 Jan 2016 14:24:00 GMT'),
  //         amount: 0.1,
  //         native_amount: 1,
  //         native_currency: 'CAD',
  //         unit_price: 10
  //       },
  //       {
  //         created_at: Date.parse('02 Jan 2016 12:22:00 GMT'),
  //         amount: 0.2,
  //         native_amount: 2.4,
  //         native_currency: 'CAD',
  //         unit_price: 12
  //       },
  //       {
  //         created_at: Date.parse('03 Jan 2016 13:22:00 GMT'),
  //         amount: 0.1,
  //         native_amount: 1.5,
  //         native_currency: 'CAD',
  //         unit_price: 15
  //       }
  //     ],
  //     sells: [
  //       {
  //         created_at: Date.parse('03 Jan 2017 13:22:00 GMT'),
  //         amount: 0.39,
  //         native_amount: 8,
  //         native_currency: 'CAD',
  //         unit_price: 20
  //       }
  //     ],
  //   },
  //   BTC: {
  //     buys: [
  //       {
  //         created_at: Date.parse('01 Jan 2016 13:22:00 GMT'),
  //         amount: 1,
  //         native_amount: 200,
  //         native_currency: 'CAD',
  //         unit_price: 200
  //       },
  //       {
  //         created_at: Date.parse('02 Jan 2016 11:03:00 GMT'),
  //         amount: 1,
  //         native_amount: 210,
  //         native_currency: 'CAD',
  //         unit_price: 210
  //       },
  //       {
  //         created_at: Date.parse('04 Feb 2016 10:21:00 GMT'),
  //         amount: 1,
  //         native_amount: 220,
  //         native_currency: 'CAD',
  //         unit_price: 220
  //       },
  //       {
  //         created_at: Date.parse('05 Feb 2016 13:22:00 GMT'),
  //         amount: 2,
  //         native_amount: 500,
  //         native_currency: 'CAD',
  //         unit_price: 250
  //       },
  //       {
  //         created_at: Date.parse('06 Feb 2016 13:22:00 GMT'),
  //         amount: 3,
  //         native_amount: 600,
  //         native_currency: 'CAD',
  //         unit_price: 300
  //       }
  //     ],
  //     sells: [
  //       {
  //         created_at: Date.parse('02 Jan 2017 13:22:00 GMT'),
  //         amount: 4,
  //         native_amount: 100,
  //         native_currency: 'CAD',
  //         unit_price: 500
  //       },
  //       {
  //         created_at: Date.parse('10 Feb 2017 13:22:00 GMT'),
  //         amount: 2,
  //         native_amount: 2000,
  //         native_currency: 'CAD',
  //         unit_price: 1000
  //       }
  //     ]
  //   }
  // };
  for (const currency of Object.keys(transactions)) {
    const buys = transactions[currency].buys;
    const sells = transactions[currency].sells;

    taxEvents = taxEvents.concat(calculateGainsWithFIFO(buys, sells, currency));
  }
  return taxEvents;
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
 * @prop {Boolean} shortTerm - Short- or long-term gain.
 */

/**
 * @typedef {Object} Amount
 * @prop {Number} amount - Quantity of currency.
 * @prop {String} currency - Type of currency.
 */
