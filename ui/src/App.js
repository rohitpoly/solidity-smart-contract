import React, { useEffect, useState } from 'react';
import {
  Button, Form, InputGroup, FormControl,
} from 'react-bootstrap';

import './App.css';
// import TableRow from './views/tableRow';

import {
  contract, isMetaMaskInstalled, metamaskInit, onboarding,
} from './libs/contracts';

let accountID = '';

function App() {
  const [btnText, setBtnText] = useState('Connect');
  const [connBtnState, setConnBtnState] = useState(false);
  const [connStatus, setConnStatus] = useState('Not Connected');
  const [accBalance, setBalance] = useState(0);

  let hasMetaMask = false;

  async function getBalance(address) {
    const balance = await contract.balanceOf(address);
    setBalance(parseInt(balance, 16));
  }

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      setConnBtnState(true);
      const accounts = await metamaskInit();
      setConnStatus(accounts[0] || 'Not able to get accounts');
      if (accounts[0]) {
        [accountID] = accounts;
        getBalance(accountID);
      }
      setConnBtnState(false);
    } catch (error) {
      console.error(error);
    }
  };

  contract.on('Transfer', (from, to, value) => {
    const amount = parseInt(value._hex, 16);
    const cleantFrom = from.replace(/\s/g, '');

    if (cleantFrom === accountID) {
      console.log('same acc');
      setBalance(accBalance - amount);
    } else {
      console.log('not same acc');
    }
  });

  const transferMoney = async (event) => {
    event.preventDefault();

    const to = event.target.toAddress.value;
    const value = parseFloat(event.target.amountSent.value);

    await contract.transfer(to, value);

    console.log('done');

    // setTimeout(()=>getBalance(), 10000);

    // console.log(accountID);
  };

  const initMeta = () => {
    if (hasMetaMask) {
      // connection
      console.log('is connected');
      onClickConnect();
    } else {
      setBtnText('Onboarding in progress');
      setConnBtnState(true);
      onboarding.startOnboarding();
    }
  };

  const initialize = () => {
    const MetaMaskClientCheck = () => {
      if (!isMetaMaskInstalled()) {
        hasMetaMask = false;
        setBtnText('Click here to install MetaMask!');
      } else {
        hasMetaMask = true;
        setBtnText('Connect');
      }
    };
    MetaMaskClientCheck();
  };

  useEffect(() => {
    console.log('using effects now');
    initialize();
  });

  return (
    <div className="App">
      <header className="App-header">
        <h3>Tutorial Token</h3>

        <p>
          Connect to Metamask to begin
          {' '}
          <br />
          {' '}
          <Button variant="outline-success" size="sm" disabled={connBtnState} onClick={initMeta}>{btnText}</Button>
          {' '}
        </p>

        <br />

        <p>
          Account ID:
          {' '}
          <code>{connStatus}</code>
        </p>

        <p>
          My Balance:
          {' '}
          <code>
            {accBalance}
            {' '}
            ETH
          </code>
        </p>
        <section className="formSection">
          <Form onSubmit={transferMoney}>
            <Form.Label htmlFor="toAddress">Send Token to Wallet Address</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon2">@</InputGroup.Text>
              <FormControl
                placeholder="To Address"
                aria-label="To Wallet Address"
                aria-describedby="basic-addon2"
                id="toAddress"
                name="toAddress"
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <FormControl aria-label="Amount (to the nearest dollar)" placeholder="Amount" type="text" id="amount" name="amountSent" />
              <InputGroup.Text>.00</InputGroup.Text>
            </InputGroup>

            <Button type="submit" variant="outline-primary">Send</Button>
            {' '}
          </Form>
        </section>
        <br />
        <br />
      </header>
    </div>
  );
}

export default App;
