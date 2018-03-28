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
import getLocale from 'utils/get-locale';

import './tax-event-list.css';

const locale = getLocale();
const currencies = ['BTC', 'BCC', 'ETH', 'LTC'];
const amount = a => {
  if (currencies.includes(a.currency)) {
    return `${a.amount.toFixed(4)} ${a.currency}`;
  }

  return a.amount.toLocaleString(locale, {
    style: 'currency',
    currency: a.currency
  });
};

const injector = stores => ({
  events: toJS(stores.transactions.taxEvents)
});

const TaxEventList = ({events}) => (
  <div>
    <Header/>
    <Body>
      <Card>
        <CardHeader
          title="Capital Gains"
        />

        <table className="TaxEventList">
          <thead>
            <tr className="TaxEventList__header">
              <th className="TaxEventList__header-cell">Date</th>
              <th className="TaxEventList__header-cell">Amount</th>
              <th className="TaxEventList__header-cell">Proceeds</th>
              <th className="TaxEventList__header-cell">Cost</th>
              <th className="TaxEventList__header-cell">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="TaxEventList__row">
                <td className="TaxEventList__cell">
                  <div className="TaxEventList__date">{format(e.created_at, 'MM/DD/YY')}</div>
                  <div className="TaxEventList__time">{format(e.created_at, 'h:mma')}</div>
                </td>
                <td className="TaxEventList__cell">
                  {amount(e.amount)}
                </td>
                <td className="TaxEventList__cell">
                  {amount(e.proceeds.amount)}
                  <div className="TaxEventList__sub">
                    {amount({
                      amount: e.proceeds.pricePer.amount,
                      currency: e.proceeds.amount.currency
                    })}/{e.proceeds.pricePer.currency}
                  </div>
                </td>
                <td className="TaxEventList__cell">
                  {amount(e.cost.amount)}
                  <div className="TaxEventList__sub">
                    {amount({
                      amount: e.cost.pricePer.amount,
                      currency: e.cost.amount.currency
                    })}/{e.cost.pricePer.currency}
                  </div>
                </td>
                <td className="TaxEventList__cell">
                  <span
                    className={cls({
                      TaxEventList__gain: e.gain.amount > 0,
                      TaxEventList__loss: e.gain.amount < 0
                    })}
                  >
                    {e.gain < 0 && '('}
                    {amount(e.gain)}
                    {e.gain < 0 && ')'}
                  </span>
                  <span
                    className={cls('TaxEventList__badge', {
                      'TaxEventList__badge--gain': e.gain.amount > 0,
                      'TaxEventList__badge--loss': e.gain.amount < 0
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
