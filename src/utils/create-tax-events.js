import uuid from 'uuid/v4';

/**
 * Convert a raw list of transactions from Coinbase into a series of tax events, including cost
 * basis and gain/loss.
 * @param {Object[]} transactions - Transaction list.
 * @returns {TaxEvent[]} List of tax events.
 */
export default (transactions) => {
  return calculateGainsWithFIFO(transactions);
};


const calculateGainsWithFIFO = (transactions) => {
  let taxEvents = []

  Object.keys(transactions).map(currency => {
    var buys = transactions[currency].buys
    var sells = transactions[currency].sells

    while(sells.length > 0) {
      if(sells[0].amount > buys[0].amount) {
        var buy = buys.shift()
        sells[0].amount -= buy.amount
        var created_at = sells[0].created_at
        var sell_amount = sells[0].amount
        var sell_native_amount = sells[0].native_amount
        var fiat_currency = sells[0].native_currency
        var buy_price_per_unit = buy.unit_price
        var sale_cost = sells[0].amount * buy_price_per_unit
        var sell_price_per_unit = sell_native_amount / sells[0].amount
      } else if(sells[0].amount < buys[0].amount) {
        var sell = sells.shift()
        buys[0].amount -= sell.amount
        var created_at = sell.created_at
        var sell_amount = sell.amount
        var sell_native_amount = sell.native_amount
        var fiat_currency = sell.native_currency
        var buy_price_per_unit = buys[0].unit_price
        var sale_cost = sell.amount * buy_price_per_unit
        var sell_price_per_unit = sell_native_amount / sell.amount
      } else {
        var buy = buys.shift()
        var sell = sells.shift()
        var created_at = sell.created_at
        var sell_amount = sell.amount
        var sell_native_amount = sell.native_amount
        var fiat_currency = sell.native_currency
        var buy_price_per_unit = buy.unit_price
        var sale_cost = sell_native_amount
        var sell_price_per_unit = sell_native_amount / sell.amount
      }
      taxEvents.push({
        id: uuid(),
        date: created_at,
        amount: {
          amount: sell_amount,
          currency: currency
        },
        cost: {
          amount: {
            amount: sale_cost,
            currency: fiat_currency
          },
          pricePer: {
            amount: buy_price_per_unit,
            currency: currency
          }
        },
        proceeds: {
          amount: {
            amount: sell_native_amount,
            currency: fiat_currency
          },
          pricePer: {
            amount: sell_price_per_unit,
            currency: currency
          }
        },
        gain: {
          amount: sell_native_amount - sale_cost,
          currency: fiat_currency
        },
        shortTerm: true
      })
    }
  })
  return taxEvents;
}

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
