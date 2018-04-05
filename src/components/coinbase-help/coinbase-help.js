import React from 'react';
import Header from 'components/header';
import Body from 'components/body';
import Card from 'components/card';
import CardHeader from 'components/card-header';
import './coinbase-help.css';

const CoinbaseHelp = () => (
  <div>
    <Header/>
    <Body>
      <Card>
        <CardHeader
          title="How do I get a Coinbase API key?"
        />
        <div className="CoinbaseHelp">
          <p>First login into you Coinbase account and go to the <strong>&quot;Settings&quot;</strong> menu, then the <strong>&quot;API access&quot;</strong> menu and finally click the <strong>&quot;+ New API&quot;</strong> button.</p>
          <img src={require('images/coinbase-help-1.png')} style={{width: '100%'}}/>
          <p>On the popup that shows up first select <strong>all</strong> on the accounts.</p>
          <p>Then select only <strong>wallet:accounts:read</strong> and <strong>wallet:transactions:read</strong>. This will allow you to read your accounts and transactions.</p>
          <p>Leave everything unselected and press &quot;Create&quot;.</p>
          <img src={require('images/coinbase-help-2.png')} style={{width: '600px'}}/>
          <p>Now copy the <strong>API key</strong> and the <strong>API Secret</strong> into the import form.</p>
          <img src={require('images/coinbase-help-3.png')} style={{width: '600px'}}/>
        </div>
      </Card>
    </Body>
  </div>
);

export default CoinbaseHelp;
