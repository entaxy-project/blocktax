import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';

@inject(stores => ({
  getCoinbaseAuthToken: stores.coinbase.getAuthToken,
  signedInToCoinbase: stores.coinbase.signedIn
}))
export default class Auth extends Component {
  static propTypes = {
    getCoinbaseAuthToken: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    signedInToCoinbase: PropTypes.bool.isRequired
  }

  componentDidUpdate() {
    if (this.props.signedInToCoinbase) {
      this.props.history.push('/dashboard');
    }
  }

  componentDidMount() {
    this.props.getCoinbaseAuthToken(this.props.location.search);
  }

  render() {
    return (
      <div>Authenticating...</div>
    );
  }
}
