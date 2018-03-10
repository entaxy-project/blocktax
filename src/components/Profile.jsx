import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  isSignInPending,
  loadUserData,
  Person
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
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

  render() {
    const {handleSignOut} = this.props;
    const {person} = this.state;

    if (isSignInPending()) {
      return null;
    }

    return (
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage} className="img-rounded avatar" id="avatar-image"/>
        </div>
        <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={handleSignOut}
            type="button"
          >
          Logout
          </button>
        </p>
      </div>
    );
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile)
    });
  }
}

Profile.propTypes = {
  handleSignOut: PropTypes.func
};

Profile.defaultProps = {
  handleSignOut: () => {}
};
