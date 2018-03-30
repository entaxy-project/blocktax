/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import format from 'date-fns/format';
import cls from 'classnames';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import CardHeader from 'components/card-header';
import Button from 'components/button';
import Disclaimer from 'components/disclaimer';
import ExportCsv from 'components/export-csv';
import getLocale from 'utils/get-locale';
import './tax-event-list.css';

const locale = getLocale();
const currencies = ['BTC', 'BCC', 'ETH', 'LTC'];
const formattedAmount = (amount, currency) => {
  if (currencies.includes(currency)) {
    return `${amount.toFixed()} ${currency}`;
  } else {
    return parseFloat(amount).toLocaleString(locale, {
      style: 'currency',
      currency: currency
    });
  }
};

const injector = stores => ({
  events: toJS(stores.transactions.taxEvents),
  totalGainsMessage: stores.transactions.totalGainsMessage
});

const TaxEventList = ({events, totalGainsMessage}) => (
  <div>
    <Header body={
      <span>
        <ExportCsv/>
        In 2017, you had a <strong>{totalGainsMessage}</strong>
        <br/>
        In <strong>Coinbase</strong> using the <strong>FIFO method</strong>.
      </span>
    }/>
    <Body>
      <Card>
        <CardHeader
          title="Capital Gains"
          controls={
            <div className="CostBasis">
              <p>Cost Basis Method</p>
              <h3>FIFO</h3>
            </div>
          }
        />

        <table className="TaxEventList">
          <thead>
            <tr className="TaxEventList__header">
              <th className="TaxEventList__header-cell">Sell Date</th>
              <th className="TaxEventList__header-cell">Amount</th>
              <th className="TaxEventList__header-cell">Proceeds</th>
              <th className="TaxEventList__header-cell">Cost</th>
              <th className="TaxEventList__header-cell-left">Buy Date</th>
              <th className="TaxEventList__header-cell">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="TaxEventList__row">
                <td className="TaxEventList__cell">
                  <div className="TaxEventList__date">{format(e.sell_date, 'MM/DD/YY')}</div>
                  <div className="TaxEventList__time">{format(e.sell_date, 'h:mma')}</div>
                </td>
                <td className="TaxEventList__cell">
                  {formattedAmount(e.units_transacted, e.source_currency)}
                </td>
                <td className="TaxEventList__cell">
                  {formattedAmount(e.sell_total_price, e.destination_currency)}
                  <div className="TaxEventList__sub">
                    {formattedAmount(e.sell_price_per_unit, e.destination_currency)}/{e.source_currency}
                  </div>
                </td>
                <td className="TaxEventList__cell">
                  {formattedAmount(e.buy_total_price, e.destination_currency)}
                  <div className="TaxEventList__sub">
                    {formattedAmount(e.buy_price_per_unit, e.destination_currency)}/{e.source_currency}
                  </div>
                </td>
                <td className="TaxEventList__cell-left">
                  <div className="TaxEventList__date">{format(e.buy_date, 'MM/DD/YY')}</div>
                  <div className="TaxEventList__time">{format(e.buy_date, 'h:mma')}</div>
                </td>
                <td className="TaxEventList__cell">
                  <span
                    className={cls({
                      TaxEventList__gain: e.gain > 0,
                      TaxEventList__loss: e.gain < 0
                    })}
                  >
                    {e.gain < 0 && '('}
                    {formattedAmount(e.gain, e.destination_currency)}
                    {e.gain < 0 && ')'}
                  </span>
                  <span
                    className={cls('TaxEventList__badge', {
                      'TaxEventList__badge--gain': e.gain > 0,
                      'TaxEventList__badge--loss': e.gain < 0
                    })}
                  >
                    {e.shortTerm ? 'S' : 'L'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Body>
    <Disclaimer/>
  </div>
);

TaxEventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default inject(injector)(TaxEventList);
