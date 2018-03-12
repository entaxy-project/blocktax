import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'mobx-react';
import {create} from 'mobx-persist';
import {isSignInPending, handlePendingSignIn, isUserSignedIn} from 'blockstack';

const hydrate = create();

export default class AsyncProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    stores: PropTypes.object.isRequired
  }

  static defaultProps = {
    children: null
  }

  async componentDidMount() {
    if (isSignInPending()) {
      await handlePendingSignIn();
      this.hydrate();
    }

    if (isUserSignedIn()) {
      this.hydrate();
    }
  }

  hydrate() {
    const {stores} = this.props;

    Promise.all(Object.entries(stores).map(([id, store]) => {
      if (store.constructor.persist) {
        return hydrate(id, store);
      }

      return null;
    }));
  }

  render() {
    const {children, stores} = this.props;

    return (
      <Provider {...stores}>
        {children}
      </Provider>
    );
  }
}
