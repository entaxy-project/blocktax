import React from 'react';
import PropTypes from 'prop-types';
import './import-button.css';

const ImportButton = ({title, image, onClick, isDisabled, confirmMsg}) => {
  const applyClick = () => {
    if (confirmMsg === undefined) {
      onClick();
    } else if (confirm(confirmMsg)) {
      onClick();
    }
  };

  return (
    <div className={`ImportButton ${isDisabled ? 'ImportButton--disabled' : ''}`}>
      <div className="ImportButton__image" style={{backgroundImage: `url(${image})`}}/>
      <div className="ImportButton__title" onClick={applyClick}>
        {title}
      </div>
    </div>
  );
};

ImportButton.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
  isDisabled: PropTypes.bool,
  confirmMsg: PropTypes.string
};

ImportButton.defaultProps = {
  onClick: () => {},
  title: ' ',
  isDisabled: false,
  confirmMsg: undefined
};

export default ImportButton;
