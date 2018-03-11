import React from 'react';
import {redirectToSignIn} from 'blockstack';

export default () => (
  <div className="panel-landing" id="section-1">
    <h1 className="landing-heading">Hello, Blockstack!</h1>
    <p className="lead">
      <button
        className="btn btn-primary btn-lg"
        id="signin-button"
        onClick={() => redirectToSignIn()}
        type="button"
      >
        Sign In with Blockstack
      </button>
    </p>
  </div>
);
