import React, {Component} from 'react';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut
} from 'blockstack';
import Profile from './profile.jsx';
import Signin from './signin.jsx';

export default class App extends Component {
  handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { isUserSignedIn() ?
            <Profile handleSignOut={this.handleSignOut}/> :
            <Signin handleSignIn={this.handleSignIn}/>
          }
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
