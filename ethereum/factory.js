import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xb359B6A9a84b153c9c61883B358147dEbC0d3D78'
);

export default instance;