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
import formatCurrency from 'utils/format-currency';
import './transaction-list.css';

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
            {transactions.map(t => (
              <tr key={t.id} className="TransactionList__row">
                <td className="TransactionList__cell">
                  <div className="TransactionList__date">{formatDate(parseDate(t.date), 'MM/DD/YY')}</div>
                  <div className="TransactionList__time">{formatDate(parseDate(t.date), 'h:mma')}</div>
                </td>
                <td className="TransactionList__cell">
                  {t.title}
                  <div className="TransactionList__sub">{t.description}</div>
                </td>
                <td className="TransactionList__cell">
                  {formatCurrency(t.units, t.unitCurrency)}
                </td>
                <td className="TransactionList__cell">
                  {formatCurrency(t.fiatAmount, t.fiatCurrency)}
                  <div className="TransactionList__sub">
                    {formatCurrency(t.pricePerUnit, t.fiatCurrency)}/{t.unitCurrency}
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
