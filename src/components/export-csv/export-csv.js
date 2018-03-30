import React from 'react';
import {toJS} from 'mobx';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {CSVLink} from 'react-csv';
import './export-csv.css';

const injector = stores => ({
  events: toJS(stores.transactions.taxEventsForCsv)
});

const ExportCsv = ({events}) => (
  <CSVLink data={events} filename="capital-gains.csv" className="ExportCsv__button Button Button--small">Download Report</CSVLink>
);

ExportCsv.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default inject(injector)(ExportCsv);
