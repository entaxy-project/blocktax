import React from 'react';
import PropTypes from 'prop-types';
import Container from './container';
import './body.css';

const Body = ({children}) => (
  <Container>
    <div className="Body">
      {children}
    </div>
  </Container>
);

Body.propTypes = {
  children: PropTypes.node
};

Body.defaultProps = {
  children: null
};

export default Body;
