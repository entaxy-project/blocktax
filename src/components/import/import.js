import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import ImportButton from 'components/import-button';
import './import.css';

const injector = stores => ({
  importTransactionsFrom: stores.transactions.importTransactionsFrom
});

const Import = ({importTransactionsFrom}) => (
  <div>
    <Header/>
    <Body>
      <Card>
        <div className="Import">
          <h1 className="Import__title">Import transactions</h1>
          <p className="Import__body">To generate your tax report, connect with your account below</p>
          <div className="Import__buttons">
            <ImportButton
              title="Import"
              image={require('images/coinbase-logo.svg')}
              onClick={() => {importTransactionsFrom('coinbase')}}
            />
            <ImportButton
              title="Coming Soon"
              image={require('images/csv-logo.svg')}
              isDisabled={true}
            />
          </div>
        </div>
      </Card>
    </Body>
  </div>
);

Import.propTypes = {
  importTransactionsFrom: PropTypes.func.isRequired
};

export default inject(injector)(Import);
