import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {withFormik} from 'formik';
import './coinbase-modal-content.css';

const injector = stores => ({
  importTransactionsFrom: stores.transactions.importTransactionsFrom
});

const CoinbaseModalContent = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <div className="CoinbaseModalContent">
    <h2>Import transactions from Coinbase</h2>
    <p>
      Your browser will be connecting directly to
      coinbase using the API key you enter bellow. So you&apos;re really importing your own data.
    </p>
    <p>
      <a href="https://www.coinbase.com/settings/api" target="_blank" rel="noopener noreferrer">Create an API key on Coinbase</a> (opens Coinbase in a new tab)
    </p>
    <p>
      <a href="/coinbase-help" target="_blank" rel="noopener noreferrer">How do I get a Coinbase API key?</a> (opens a new tab)
    </p>

    <p>Please enter your Coinbase API key bellow:</p>
    <form onSubmit={handleSubmit} className="CoinbaseModalContent__form">
      <div className="CoinbaseModalContent__form-control">
        <label>API Key</label>
        <input
          type="text"
          name="apiKey"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.apiKey}
        />
        {touched.apiKey && errors.apiKey && <div className="CoinbaseModalContent__field-error">{errors.apiKey}</div>}
      </div>
      <div className="CoinbaseModalContent__form-control">
        <label>API Secret</label>
        <input
          type="text"
          name="apiSecret"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.apiSecret}
        />
        {touched.apiSecret && errors.apiSecret && <div className="CoinbaseModalContent__field-error">{errors.apiSecret}</div>}
      </div>

      {errors.global && <div className="GlobalError">{errors.global}</div>}
      {isSubmitting ? (
        <div className="CoinbaseModalContent__actions">

          <button type="submit" className="Button Button--small Button--disabled">
            <div className="lds-dual-ring"/>
            Importing ...
          </button>
        </div>
      ) : (
        <div className="CoinbaseModalContent__actions">
          <button type="submit" className="Button Button--small">Import</button>
        </div>
      )}
    </form>
  </div>
);

CoinbaseModalContent.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired
};

export default inject(injector)(withFormik({
  mapPropsToValues: () => ({apiKey: '', apiSecret: ''}),
  validate: values => {
    const errors = {};
    if (!values.apiKey) {
      errors.apiKey = 'Required';
    }
    if (!values.apiSecret) {
      errors.apiSecret = 'Required';
    }
    return errors;
  },
  handleSubmit: (
    values,
    {
      props,
      setSubmitting,
      setErrors
    }
  ) => {
    setSubmitting(true);
    props.importTransactionsFrom('coinbase', values.apiKey, values.apiSecret)
      .then(() => {
        setSubmitting(false);
        props.history.push('/capital-gains');
      }).catch(() => {
        setSubmitting(false);
        setErrors({global: 'Sorry, something went wrong.'});
      });
  }
})(CoinbaseModalContent));
