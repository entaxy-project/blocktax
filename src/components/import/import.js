import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import ImportButton from 'components/import-button';
import './import.css';

const injector = stores => ({
  signInToCoinbase: stores.coinbase.signIn,
  signedInToCoinbase: stores.coinbase.signedIn,
  importFromCoinbase: stores.coinbase.fetchTransactions,
  signOutOfCoinbase: stores.coinbase.signOut
});

const Import = ({signInToCoinbase, signedInToCoinbase, importFromCoinbase, signOutOfCoinbase}) => (
  <div>
    <Header/>
    <Body>
      <Card>
        <div className="Import">
          <h1 className="Import__title">Import transactions</h1>
          <p className="Import__body">To generate your tax report, connect with your account below</p>
          <div className="Import__buttons">
            {!signedInToCoinbase && (
              <ImportButton
                title="Connect"
                image={require('images/coinbase-logo.svg')}
                onClick={signInToCoinbase}
              />
            )}
            {signedInToCoinbase && (
              <ImportButton
                title="Re-import transactions"
                image={require('images/coinbase-logo.svg')}
                onClick={importFromCoinbase}
                confirmMsg="Are you sure? This will delete all existing transactions."
                disconnectAction={signOutOfCoinbase}
              />
            )}
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
  signInToCoinbase: PropTypes.func.isRequired,
  signedInToCoinbase: PropTypes.bool.isRequired,
  importFromCoinbase: PropTypes.func.isRequired,
  signOutOfCoinbase: PropTypes.func.isRequired
};

export default inject(injector)(Import);
