import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import ConnectButton from './connect-button';
import './connect-exchange.css';

const injector = stores => ({
  signIn: stores.coinbase.signIn
});

const ConnectExchange = ({signIn}) => (
  <div className="ConnectExchange">
    <h1 className="ConnectExchange__title">Import your exchange or wallet</h1>
    <p className="ConnectExchange__body">To generate your tax report, connect with your account below</p>
    <div className="ConnectExchange__buttons">
      <ConnectButton
        title="Connect"
        image={require('../images/coinbase-logo.svg')}
        onClick={signIn}
      />
    </div>
  </div>
);

ConnectExchange.propTypes = {
  signIn: PropTypes.func.isRequired
};

export default inject(injector)(ConnectExchange);
