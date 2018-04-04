import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import CardHeader from 'components/card-header';
import Button from 'components/button';
import './reset.css';
import icon from 'images/disclaimet-icon.png';

const injector = stores => ({
  resetState: stores.ui.resetState
});

class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.resetState();
    window.location = `${window.location.origin}/import`;
  }

  render () {
    return (
      <div>
        <Header/>
        <Body>
          <Card>
            <CardHeader
              title="Reset and start over"
            />
            <div className="Reset">
              <img src={icon} className="Reset__icon"/>
              <p>Clickng the button bellow with delete <strong>all</strong> your data.</p>
              <p>This is useful in cases when you just want to start over from scratch.</p>
              <p>Once you delete your data there is <strong>no way to recover it.</strong></p>
              <Button small onClick={this.handleClick}>I understand, delete all my data!</Button>
            </div>
          </Card>
        </Body>
      </div>
    );
  }
}

Reset.propTypes = {
  resetState: PropTypes.func
};

export default inject(injector)(Reset);
