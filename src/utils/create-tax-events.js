/* eslint-disable camelcase */

import uuid from 'uuid/v4';
import difference_in_days from 'date-fns/difference_in_days';

const calculateGainsWithFIFO = (buys, sells, source_currency) => {
  const taxEvents = [];
  const ONE_YEAR = 365; // Days
  let buy;
  let sell;
  let buy_date;
  let sell_date;
  let units_transacted;
  let sell_price_per_unit;
  let destination_currency;
  let buy_price_per_unit;

  while (sells.length > 0) {
    if (sells[0].amount.gt(buys[0].amount)) {
      buy = buys.shift();
      sells[0].amount = sells[0].amount.minus(buy.amount);
      buy_date = buy.created_at;
      sell_date = sells[0].created_at;
      // Amount
      units_transacted = buy.amount;
      // Proceeds
      sell_price_per_unit = sells[0].unit_price;
      destination_currency = sells[0].native_currency;
      // Cost
      buy_price_per_unit = buy.unit_price;
    } else if (sells[0].amount.lt(buys[0].amount)) {
      sell = sells.shift();
      buys[0].amount = buys[0].amount.minus(sell.amount);
      buy_date = buys[0].created_at;
      sell_date = sell.created_at;
      // Amount
      units_transacted = sell.amount;
      // Proceeds
      sell_price_per_unit = sell.unit_price;
      destination_currency = sell.native_currency;
      // Cost
      buy_price_per_unit = buys[0].unit_price;
    } else {
      buy = buys.shift();
      sell = sells.shift();
      buy_date = buy.created_at;
      sell_date = sell.created_at;
      // Amount
      units_transacted = sell.amount;
      // Proceeds
      sell_price_per_unit = sell.unit_price;
      destination_currency = sell.native_currency;
      // Cost
      buy_price_per_unit = buy.unit_price;
    }
    const buy_total_price = units_transacted.times(buy_price_per_unit);
    const sell_total_price = units_transacted.times(sell_price_per_unit);

    taxEvents.push({
      id: uuid(),
      units_transacted,
      source_currency,
      destination_currency,
      buy_date,
      buy_total_price,
      buy_price_per_unit,
      sell_date,
      sell_total_price,
      sell_price_per_unit,
      gain: sell_total_price.minus(buy_total_price),
      shortTerm: difference_in_days(sell_date, buy_date) <= ONE_YEAR
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
  // import Big  from 'big.js';
  // transactions = {
  //   ETH: {
  //     buys: [
  //       {
  //         created_at: Date.parse('01 Jan 2016 14:24:00 GMT'),
  //         amount: Big(0.1),
  //         native_amount: Big(1),
  //         native_currency: 'CAD',
  //         unit_price: Big(10)
  //       },
  //       {
  //         created_at: Date.parse('02 Jan 2016 12:22:00 GMT'),
  //         amount: Big(0.2),
  //         native_amount: Big(2.4),
  //         native_currency: 'CAD',
  //         unit_price: Big(12)
  //       },
  //       {
  //         created_at: Date.parse('03 Jan 2016 13:22:00 GMT'),
  //         amount: Big(0.1),
  //         native_amount: Big(1.5),
  //         native_currency: 'CAD',
  //         unit_price: Big(15)
  //       }
  //     ],
  //     sells: [
  //       {
  //         created_at: Date.parse('03 Jan 2017 13:22:00 GMT'),
  //         amount: Big(0.39),
  //         native_amount: Big(8),
  //         native_currency: 'CAD',
  //         unit_price: Big(20)
  //       }
  //     ],
  //   },
  //   BTC: {
  //     buys: [
  //       {
  //         created_at: Date.parse('01 Jan 2016 13:22:00'),
  //         amount: Big(0.0034),
  //         native_amount: Big(25.448898),
  //         native_currency: 'CAD',
  //         unit_price: Big(7484.97)
  //       },
  //       {
  //         created_at: Date.parse('02 Jan 2016 11:03:00'),
  //         amount: Big(0.00154),
  //         native_amount: Big(11.5268538),
  //         native_currency: 'CAD',
  //         unit_price: Big(7484.97)
  //       },
  //       {
  //         created_at: Date.parse('04 Feb 2016 10:21:00'),
  //         amount: Big(1),
  //         native_amount: Big(220),
  //         native_currency: 'CAD',
  //         unit_price: Big(7484.97)
  //       },
  //       {
  //         created_at: Date.parse('05 Feb 2016 13:43:00'),
  //         amount: Big(2),
  //         native_amount: Big(500),
  //         native_currency: 'CAD',
  //         unit_price: Big(7484.97)
  //       },
  //       {
  //         created_at: Date.parse('06 Feb 2016 4:26:00'),
  //         amount: Big(13),
  //         native_amount: Big(600),
  //         native_currency: 'CAD',
  //         unit_price: Big(7484.97)
  //       }
  //     ],
  //     sells: [
  //       {
  //         created_at: Date.parse('02 Jan 2017 3:02:00'),
  //         amount: Big(0.004),
  //         native_amount: Big(60),
  //         native_currency: 'CAD',
  //         unit_price: Big(15000)
  //       },
  //       {
  //         created_at: Date.parse('10 Feb 2017 15:33:00'),
  //         amount: Big(2),
  //         native_amount: Big(2000),
  //         native_currency: 'CAD',
  //         unit_price: Big(1000)
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
