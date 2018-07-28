import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    //In the browser
    web3 = new Web3(window.web3.currentProvider);

} else {
    //We are on server or user not running metamask

    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/3df342ddbf9d497f84e1a918fc4a75d0'
    );

    web3 = new Web3(provider);

}

export default web3;