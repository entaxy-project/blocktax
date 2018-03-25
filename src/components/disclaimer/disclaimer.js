import React from 'react';
import Button from 'components/button';
import './disclaimer.css';

const Disclaimer = () => (
  <div className="Disclaimer">
	  <div className="Disclaimer--wrapper">
	    <div className="Disclaimer--title">Disclaimer:</div>
	    <div className="Disclaimer--content">
	    	The information contained on BlockTax is provided for general information purposes only.
	    	It is not intended nor should it be used as a substitute for tax, audit, accounting,
	    	investment, consulting or other professional advice on any subject matter.
	    </div>
	    <Button small href='transactions' className="Disclaimer--button">Got it!</Button>
	  </div>
  </div>
);

export default Disclaimer;




