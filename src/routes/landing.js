import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';

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
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">Hello, Blockstack!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={signIn}
            type="button"
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}
