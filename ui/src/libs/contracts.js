import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

const { ethereum } = window;

const contractAddress = '0xCa35291eBA2246E4c06d8b583a4f8CAB44B4Cc74';

const abi = [{ inputs: [{ internalType: 'string', name: '_name', type: 'string' }], stateMutability: 'nonpayable', type: 'constructor' }, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'from', type: 'address',
  }, {
    indexed: true, internalType: 'address', name: 'to', type: 'address',
  }, {
    indexed: false, internalType: 'uint256', name: 'value', type: 'uint256',
  }],
  name: 'Transfer',
  type: 'event',
}, {
  inputs: [{ internalType: 'address', name: 'user', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function',
}, {
  inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'burn', outputs: [], stateMutability: 'nonpayable', type: 'function',
}, {
  inputs: [], name: 'getName', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function',
}, {
  inputs: [{ internalType: 'address', name: 'reciever', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'mint', outputs: [], stateMutability: 'nonpayable', type: 'function',
}, {
  inputs: [{ internalType: 'address', name: 'reciever', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [], stateMutability: 'nonpayable', type: 'function',
}];

const provider = new ethers.providers.Web3Provider(ethereum);

const signer = provider.getSigner();

// const gas = 21000;

// const transactionParams = {
//   from: accountID,
//   to,
//   value: value.toString(16),
//   gasPrice: '0x09184e72a000',
//   gas: gas.toString(16),
// };

// ethereum
//   .request({
//     method: 'eth_sendTransaction',
//     params: [transactionParams]
//   })
//   .then((txHash) => {

//     txnHistory.push({to, amount: value, hash: txHash});
//     console.log(txHash);
//     setTxn(txnHistory);

//   })
//   .catch((error) => console.error);

export const isMetaMaskInstalled = () => Boolean(ethereum && ethereum.isMetaMask);

export const contract = new ethers.Contract(contractAddress, abi, signer);

export const metamaskInit = async () => {
  await ethereum.request({ method: 'eth_requestAccounts' });
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  return accounts;
};

export const onboarding = new MetaMaskOnboarding({ forwarderOrigin: 'http://localhost:9010' });
