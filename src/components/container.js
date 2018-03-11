import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isSignInPending, handlePendingSignIn} from 'blockstack';

export default class Container extends Component {
  render() {
    const {children} = this.props;

    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          {children}
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(_ => {
        window.location = window.location.origin;
      });
    }
  }
}

Container.propTypes = {
  children: PropTypes.node
};

Container.defaultProps = {
  children: null
};
