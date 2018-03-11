import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {signUserOut} from 'blockstack';
import withPerson from '../utils/with-person';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const Dashboard = ({person, history}) => (
  <div className="panel-welcome" id="section-2">
    <div className="avatar-section">
      <img src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage} className="img-rounded avatar" id="avatar-image"/>
    </div>
    <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
    <p className="lead">
      <button
        className="btn btn-primary btn-lg"
        id="signout-button"
        onClick={() => {
          signUserOut();
          history.push('/');
        }}
        type="button"
      >
      Logout
      </button>
    </p>
  </div>
);

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired
};

export default withPerson(withRouter(Dashboard));
