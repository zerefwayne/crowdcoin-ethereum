const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'crystal shield sense fun estate notable wire gain opera scissors awesome flag',
  'https://rinkeby.infura.io/v3/3df342ddbf9d497f84e1a918fc4a75d0'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  ).deploy({ data: '0x' + compiledFactory.bytecode })
    .send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};

deploy();