const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas:'1000000'});
});

describe('Testing Lottery', () => {
    it('Deploys a contract', ()=>{
        assert.ok(lottery.options.address);
    });
    it('allows one account to enter', async () => {
        await lottery.methods.enterLottery().send({
            from:accounts[0],
            value: web3.utils.toWei('1', 'ether'),
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);

    });
    it('allows multiple account to enter', async () => {

        for (let i = 0; i < 3; i++){   
            await lottery.methods.enterLottery().send({
            from:accounts[i],
            value: web3.utils.toWei('1', 'ether'),
            });
        }
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });


        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(3, players.length);
    });

    it('Requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enterLottery().send({
                from:accounts[0],
                value: web3.utils.toWei('.01', 'ether'),
            });
            assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('only manager can pick winner', async() => {
        try {
            await lottery.methods.pickWinner().send({
                from:account[0],
            });
            assert(false);
        } catch (err){
            assert(err);
        }
    });
    it('send money to winner and resets player array', async () => {
        await lottery.methods.enterLottery().send({
            from:accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('.8', 'ether'));
    });

});