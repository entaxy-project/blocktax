import React from 'react';
import PropTypes from 'prop-types';

const TransactionList = ({transactions}) => (
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Fiat Amount</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map(t => (
        <tr key={t.id}>
          <td>{t.created_at}</td>
          <td>{t.type}</td>
          <td>{t.amount.amount} {t.amount.currency}</td>
          <td>{t.native_amount.amount} {t.native_amount.currency}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object)
};

TransactionList.defaultProps = {
  transactions: []
};

export default TransactionList;
