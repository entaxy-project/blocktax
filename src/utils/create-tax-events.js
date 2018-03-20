import uuid from 'uuid/v4';

/**
 * Convert a raw list of transactions from Coinbase into a series of tax events, including cost
 * basis and gain/loss.
 * @param {Object[]} transactions - Transaction list.
 * @returns {TaxEvent[]} List of tax events.
 */
export default (transactions) => {
  console.log(transactions)

  transactions = {
    'BTC': {
      buys: [
        {
          created_at: "2018-02-10T17:48:08Z",
          amount: 1,
          native_amount: 200,
          native_currency: "CAD",
          unit_price: 200
        },
        {
          created_at: "2018-02-10T17:48:08Z",
          amount: 2,
          native_amount: 500,
          native_currency: "CAD",
          unit_price: 250
        },
        {
          created_at: "2018-02-10T17:48:08Z",
          amount: 3,
          native_amount: 600,
          native_currency: "CAD",
          unit_price: 300
        }
      ],
      sells: [
        {
          created_at: "2018-02-22T17:48:08Z",
          amount: 4,
          native_amount: 1000,
          native_currency: "CAD",
          unit_price: 500
        },
        {
          created_at: "2018-02-22T17:48:08Z",
          amount: 2,
          native_amount: 2000,
          native_currency: "CAD",
          unit_price: 1000
        }
      ]
    }
  }
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
        // Amount
        var sell_amount = buy.amount
        // Proceeds
        var sell_price_per_unit = sells[0].unit_price
        var sell_native_amount = sell_amount * sell_price_per_unit
        var fiat_currency = sells[0].native_currency
        // Cost
        var buy_price_per_unit = buy.unit_price
        var cost = buy.amount * buy_price_per_unit

      } else if(sells[0].amount < buys[0].amount) {
        var sell = sells.shift()
        buys[0].amount -= sell.amount
        var created_at = sell.created_at
        // Amount
        var sell_amount = sell.amount
        // Proceeds
        var sell_price_per_unit = sell.unit_price
        var sell_native_amount = buys[0].amount * sell_price_per_unit
        var fiat_currency = sell.native_currency
        // Cost
        var buy_price_per_unit = buys[0].unit_price
        var cost = sell_amount * buy_price_per_unit
      } else {
        var buy = buys.shift()
        var sell = sells.shift()
        var created_at = sell.created_at
        // Amount
        var sell_amount = sell.amount
        // Proceeds
        var sell_price_per_unit = sell.unit_price
        var sell_native_amount = sell.native_amount
        var fiat_currency = sell.native_currency
        // Cost
        var buy_price_per_unit = buy.unit_price
        var cost = sell_amount * buy_price_per_unit
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
            amount: cost,
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
          amount: sell_native_amount - cost,
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
