import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './import-from-coinbase.css';

@inject(stores => ({
  coinbaseAuthState: stores.coinbase.oauthState,
  getCoinbaseAuthToken: stores.coinbase.getAuthToken,
  signedInToCoinbase: stores.coinbase.signedIn
}))
export default class ImportFromCoinbase extends Component {
  static propTypes = {
    coinbaseAuthState: PropTypes.string,
    getCoinbaseAuthToken: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    signedInToCoinbase: PropTypes.bool.isRequired
  }

  static defaultProps = {
    coinbaseAuthState: null
  }

  componentDidUpdate() {
    const {coinbaseAuthState, signedInToCoinbase, getCoinbaseAuthToken, history, location} = this.props;

    if (signedInToCoinbase) {
      history.push('/transactions');
    } else if (typeof coinbaseAuthState === 'string') {
      getCoinbaseAuthToken(location.search);
    }
  }

  render() {
    return (
      <div className="ImportFromCoinbase">
        <h1 className="ImportFromCoinbase__title">Authenticating...</h1>
      </div>
    );
  }
}
