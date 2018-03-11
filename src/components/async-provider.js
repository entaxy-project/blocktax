import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'mobx-react';
import {create} from 'mobx-persist';

const hydrate = create();

export default class AsyncProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    store: PropTypes.object.isRequired
  }

  static defaultProps = {
    children: null
  }

  state = {
    ready: false
  }

  async componentDidMount() {
    await hydrate('store', this.props.store);

    this.setState({
      ready: true
    });
  }

  render() {
    const {children, store} = this.props;

    if (!this.state.ready) {
      return null;
    }

    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }
}
