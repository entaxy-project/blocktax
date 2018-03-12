import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './auth.css';

@inject(stores => ({
  coinbaseAuthState: stores.coinbase.oauthState,
  getCoinbaseAuthToken: stores.coinbase.getAuthToken,
  signedInToCoinbase: stores.coinbase.signedIn
}))
export default class Auth extends Component {
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
      history.push('/dashboard');
    } else if (typeof coinbaseAuthState === 'string') {
      getCoinbaseAuthToken(location.search);
    }
  }

  render() {
    return (
      <div className="Auth">
        <h1 className="Auth__title">Authenticating...</h1>
      </div>
    );
  }
}
