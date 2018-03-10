import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Signin extends Component {
  render() {
    const {handleSignIn} = this.props;

    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">Hello, Blockstack!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={handleSignIn}
            type="button"
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}

Signin.propTypes = {
  handleSignIn: PropTypes.func
};

Signin.defaultProps = {
  handleSignIn: () => {}
};
