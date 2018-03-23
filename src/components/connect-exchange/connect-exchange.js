import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Card from 'components/card';
import ConnectButton from 'components/connect-button';
import './connect-exchange.css';

const injector = stores => ({
  signIn: stores.coinbase.signIn
});

const ConnectExchange = ({signIn}) => (
  <Card>
    <div className="ConnectExchange">
      <h1 className="ConnectExchange__title">Import your exchange or wallet</h1>
      <p className="ConnectExchange__body">To generate your tax report, connect with your account below</p>
      <div className="ConnectExchange__buttons">
        <ConnectButton
          title="Connect"
          image={require('images/coinbase-logo.svg')}
          onClick={signIn}
        />
        <ConnectButton
          title="Coming Soon"
          image={require('images/csv-logo.svg')}
          isDisabled={true}
        />
      </div>
    </div>
  </Card>
);

ConnectExchange.propTypes = {
  signIn: PropTypes.func.isRequired
};

export default inject(injector)(ConnectExchange);
