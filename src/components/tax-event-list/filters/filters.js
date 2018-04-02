import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './filters.css';

const injector = stores => ({
  searcheableAttributes: stores.transactions.searcheableAttributes,
  query: stores.transactions.query,
  setQuery: stores.transactions.setQuery
});

class Filters extends React.Component {
  constructor({props}) {
    super(props);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.state = {
      year: null
    };

  }

	handleYearChange(event) {
    this.setState({year: event.target.value});
  }

  render() {
  	const {searcheableAttributes} = this.props;
  	console.log(searcheableAttributes)
  	return(
		  <div className="Filters">
		    <form className="Filters__form">
		      <div className="Filters__form-control">
		        <select value={this.state.value} onChange={this.handleYearChange}>
		        	{searcheableAttributes.gains.currencies.map((currency) => <option value={currency}>{currency}</option>)}
		        </select>
		      </div>
		    </form>
		  </div>
		);
  }
}

Filters.propTypes = {
  searcheableAttributes: PropTypes.object.isRequired
};

export default inject(injector)(Filters);
