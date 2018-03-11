import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'mobx-react';
import {create} from 'mobx-persist';

const hydrate = create();

export default class AsyncProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    stores: PropTypes.object.isRequired
  }

  static defaultProps = {
    children: null
  }

  state = {
    ready: false
  }

  async componentDidMount() {
    const {stores} = this.props;

    await Promise.all(Object.entries(stores).map(([id, store]) => {
      if (store.constructor.persist) {
        return hydrate(id, store);
      }

      return Promise.resolve();
    }));

    this.setState({
      ready: true
    });
  }

  render() {
    const {children, stores} = this.props;

    if (!this.state.ready) {
      return null;
    }

    return (
      <Provider {...stores}>
        {children}
      </Provider>
    );
  }
}
