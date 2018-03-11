import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import Card from './card';

const amount = a => `${a.amount} ${a.currency}`;

const injector = stores => ({
  events: toJS(stores.coinbase.taxEvents)
});

const TransactionList = ({events}) => (
  <Card>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Proceeds</th>
          <th>Cost</th>
          <th>Gain/Loss</th>
        </tr>
      </thead>
      <tbody>
        {events.map(e => (
          <tr key={e.id}>
            <td>{e.date}</td>
            <td>{amount(e.amount)}</td>
            <td>
              {amount(e.proceeds.amount)}
              <small>{e.proceeds.pricePer.amount} {e.proceeds.amount.currency} / {e.proceeds.pricePer.currency}</small>
            </td>
            <td>
              {amount(e.cost.amount)}
              <small>{e.cost.pricePer.amount} {e.cost.amount.currency} / {e.cost.pricePer.currency}</small>
            </td>
            <td>{amount(e.gain)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

TransactionList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default inject(injector)(TransactionList);
