import React from 'react';
import {NavLink} from 'react-router-dom';
import './top-nav.css';

const TopNav = () => (
  <div className="TopNav">
    <NavLink to="/transactions" className="TopNav__item" activeClassName="active">Transaction History</NavLink>
    <NavLink to="/capital-gains" className="TopNav__item" activeClassName="active">Capital Gains</NavLink>
    <NavLink to="/import" className="TopNav__item" activeClassName="active">Import Transactions</NavLink>
  </div>
);

export default TopNav;
