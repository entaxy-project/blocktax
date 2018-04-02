import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import './filters.css';
import caretDown from 'images/caret-down.svg';

const injector = stores => ({
  searcheableAttributes: toJS(stores.transactions.searcheableAttributes),
  gainsQuery: toJS(stores.transactions.gainsQuery),
  setGainsQuery: stores.transactions.setGainsQuery
});

class Filters extends React.Component {
  constructor({searcheableAttributes, gainsQuery, setGainsQuery}) {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.searcheableAttributes = searcheableAttributes;
    this.setGainsQuery = setGainsQuery;
    this.gainsQuery = gainsQuery;
    this.state = this.gainsQuery;
  }

  async handleChange(event) {
    if (event.target.value === '') {
      const state = this.state;
      delete state[event.target.name];
      await this.setState(state, () => this.setGainsQuery(this.state));
    } else {
      await this.setState({[event.target.name]: event.target.value}, () => this.setGainsQuery(this.state));
    }
  }

  optionsFor(array) {
    const options = [];
    for (const item of array) {
      options.push(<option key={item} value={item}>{item}</option>);
    }
    return options;
  }

  render() {
    const {searcheableAttributes} = this.props;
    return (
      <div className="Filters">
        <form className="Filters__form">
          <div className="Filters__form-control">
            <select
              name="currency"
              value={this.state.currency}
              onChange={this.handleChange}
              style={{backgroundImage: `url(${caretDown}), linear-gradient(to bottom, var(--color-blue), var(--color-cyan))`}}
            >
              <option key="all" value="">All currencies</option>
              {this.optionsFor(searcheableAttributes.gains.currencies)}
            </select>
            <select
              name="year"
              value={this.state.year}
              onChange={this.handleChange}
              style={{backgroundImage: `url(${caretDown}), linear-gradient(to bottom, var(--color-blue), var(--color-cyan))`}}
            >
              <option key="all" value="">All years</option>
              {this.optionsFor(searcheableAttributes.gains.years)}
            </select>
            <select
              name="term"
              value={this.state.term}
              onChange={this.handleChange}
              style={{backgroundImage: `url(${caretDown}), linear-gradient(to bottom, var(--color-blue), var(--color-cyan))`}}
            >
              <option key="all" value="">Long and Short</option>
              {this.optionsFor(searcheableAttributes.gains.terms)}
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
