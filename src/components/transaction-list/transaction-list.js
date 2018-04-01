/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parse';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import CardHeader from 'components/card-header';
import Pagination from 'components/pagination';
import getLocale from 'utils/get-locale';
import './transaction-list.css';

const locale = getLocale();
const currencies = ['BTC', 'BCC', 'ETH', 'LTC'];
const amount = a => {
  if (currencies.includes(a.currency)) {
    return `${parseFloat(a.amount).toFixed(4)} ${a.currency}`;
  }

  return parseFloat(a.amount).toLocaleString(locale, {
    style: 'currency',
    currency: a.currency
  });
};
const pricePer = (crypto, fiat) => {
  const moneySpent = parseFloat(fiat.amount);
  const coinsBought = parseFloat(crypto.amount);

  return moneySpent / coinsBought;
};

const injector = stores => ({
  changePage: stores.ui.changeDashboardPage,
  currentPage: stores.ui.dashboardPage,
  pageCount: stores.ui.dashboardPageCount,
  transactions: toJS(stores.ui.dashboardTransactions)
});

const TransactionList = ({changePage, currentPage, pageCount, transactions}) => (
  <div>
    <Header/>
    <Body>
      <Card>
        <CardHeader
          title="Transaction History"
        />
        <table className="TransactionList">
          <thead>
            <tr className="TransactionList__header">
              <th className="TransactionList__header-cell">Date</th>
              <th className="TransactionList__header-cell">Type</th>
              <th className="TransactionList__header-cell">Amount</th>
              <th className="TransactionList__header-cell">Value</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className="TransactionList__row">
                <td className="TransactionList__cell">
                  <div className="TransactionList__date">{formatDate(parseDate(transaction.created_at), 'MM/DD/YY')}</div>
                  <div className="TransactionList__time">{formatDate(parseDate(transaction.created_at), 'h:mma')}</div>
                </td>
                <td className="TransactionList__cell">
                  {transaction.details.title}
                  <div className="TransactionList__sub">{transaction.details.subtitle}</div>
                </td>
                <td className="TransactionList__cell">
                  {amount(transaction.amount)}
                </td>
                <td className="TransactionList__cell">
                  {amount(transaction.native_amount)}
                  <div className="TransactionList__sub">
                    {amount({
                      amount: pricePer(transaction.amount, transaction.native_amount),
                      currency: transaction.native_amount.currency
                    })}/{transaction.amount.currency}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length > 0 && (
          <div className="TransactionList__pagination">
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              onChange={changePage}
            />
          </div>
        )}
      </Card>
    </Body>
  </div>
);

TransactionList.propTypes = {
  changePage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default inject(injector)(TransactionList);
