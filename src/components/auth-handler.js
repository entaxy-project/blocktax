import {Component} from 'react';
import PropTypes from 'prop-types';
import {isSignInPending, handlePendingSignIn} from 'blockstack';

// @TODO Find a way to move the code in `componentWillMount` somewhere more top-level
export default class Container extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(_ => {
        window.location = window.location.origin;
      });
    }
  }

  render() {
    return this.props.children;
  }
}
