import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Button from 'components/button';
import './disclaimer.css';

const injector = stores => ({
  disclaimerIsVisible: stores.ui.disclaimerIsVisible,
  hideDisclaimer: stores.ui.hideDisclaimer
});

const Disclaimer = ({disclaimerIsVisible, hideDisclaimer}) => {
  if (disclaimerIsVisible) {
  	return (
		  <div className="Disclaimer">
			  <div className="Disclaimer--wrapper">
			    <div className="Disclaimer--title">Disclaimer:</div>
			    <div className="Disclaimer--content">
			    	The information contained on BlockTax is provided for general information purposes only.
			    	It is not intended nor should it be used as a substitute for tax, audit, accounting,
			    	investment, consulting or other professional advice on any subject matter.
			    </div>
			    <Button small className="Disclaimer--button" onClick={hideDisclaimer}>Got it!</Button>
			  </div>
		  </div>
		)
  } else {
  	return null;
  }
}

Disclaimer.propTypes = {
  disclaimerIsVisible: PropTypes.bool.isRequired,
  hideDisclaimer: PropTypes.func.isRequired
};

export default inject(injector)(Disclaimer);
