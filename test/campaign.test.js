const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async() => {

    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({data: compiledFactory.bytecode}).send({from: accounts[0], gas:'1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    const addresses = await factory.methods.getDeployedCampaigns().call(); 
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
    
});

describe('Campaigns', ()=>{

    it('deploys a factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as manager', async () => {
    
        const manager = await campaign.methods.manager().call();

        assert.equal(accounts[0], manager);
        
    });

    it('can contribute money to campaign, marks them approvers', async() => {

        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);

    });

    it('requires a minimum amount of money', async()=>{

        try{

            await campaign.methods.contribute().send({
                value:'5',
                from: accounts[1]
            });

            assert(false);

        } catch(err) {

            assert(err);

        }

    });

    it('allows manager to make a request', async () => {

        await campaign.methods.createRequest("Buy batteries", '100', accounts[5])
                .send({
                    from: accounts[0],
                    gas: '1000000'
                });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy batteries', request.description);

    });

    it('processes requests', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('3', 'ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('2', 'ether'), accounts[5]).send({
                from: accounts[0],
                gas:'1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas:'1000000'
        });

        let oldBalance = await web3.eth.getBalance(accounts[5]);

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas:'1000000'
        });

        let newBalance = await web3.eth.getBalance(accounts[5]);
        oldBalance = web3.utils.fromWei(oldBalance, 'ether');
        oldBalance = parseFloat(oldBalance);

        newBalance = web3.utils.fromWei(newBalance, 'ether');
        newBalance = parseFloat(newBalance);

        console.log(oldBalance, '=>', newBalance);

        assert(newBalance > oldBalance);
    });

});

