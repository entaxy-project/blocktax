import React, {Component} from 'react';
import {Person, loadUserData} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default Target => class WithPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        }
      }
    };
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile)
    });
  }

  render() {
    return <Target person={this.state.person} {...this.props}/>;
  }
};
