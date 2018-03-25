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
import Button from 'components/button';
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
  fetchTransactions: stores.coinbase.fetchTransactions,
  pageCount: stores.ui.dashboardPageCount,
  transactions: toJS(stores.ui.dashboardTransactions),
  toggleShowTaxes: stores.ui.toggleShowTaxes
});

const TransactionList = ({changePage, currentPage, fetchTransactions, pageCount, transactions, toggleShowTaxes}) => (
  <div>
    <Header/>
    <Body>
      <Card>
        <CardHeader
          title="Transaction History"
          controls={
            <div>
              <Button small href='capital-gains'>Capital Gains</Button>
            </div>
          }
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
            {transactions.map(e => (
              <tr key={e.id} className="TransactionList__row">
                <td className="TransactionList__cell">
                  <div className="TransactionList__date">{formatDate(parseDate(e.created_at), 'MM/DD/YY')}</div>
                  <div className="TransactionList__time">{formatDate(parseDate(e.created_at), 'h:mma')}</div>
                </td>
                <td className="TransactionList__cell">
                  {e.details.title}
                  <div className="TransactionList__sub">{e.details.subtitle}</div>
                </td>
                <td className="TransactionList__cell">
                  {amount(e.amount)}
                </td>
                <td className="TransactionList__cell">
                  {amount(e.native_amount)}
                  <div className="TransactionList__sub">
                    {amount({
                      amount: pricePer(e.amount, e.native_amount),
                      currency: e.native_amount.currency
                    })}/{e.amount.currency}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="TransactionList__pagination">
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onChange={changePage}
          />
        </div>
      </Card>
    </Body>
  </div>
);

TransactionList.propTypes = {
  changePage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleShowTaxes: PropTypes.func.isRequired
};

export default inject(injector)(TransactionList);
