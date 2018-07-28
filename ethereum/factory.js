import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xe9D3407CdEF1696BBD1F92900026e1761B7F5607'
);

export default instance;