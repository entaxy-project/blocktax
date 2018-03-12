import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Button from 'components/button';
import Logo from 'components/logo';
import './landing.css';

@inject(stores => ({
  signIn: stores.blockstack.signIn
}))
export default class Landing extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired
  }

  render() {
    const {signIn} = this.props;

    return (
      <div className="Landing">
        <div className="Landing__content">
          <div className="Landing__logo">
            <Logo/>
          </div>
          <div className="Landing__text">
            <h1 className="Landing__title">Your Crypto Taxes Simple & Private</h1>
            <p className="Landing__body">Generate a tax report for Coinbase transactions with the push of a button, decentralized so your data stays yours.</p>
            <Button onClick={signIn}>Log In with Blockstack</Button>
          </div>
        </div>
        <div className="Landing__illustration"/>
      </div>
    );
  }
}
