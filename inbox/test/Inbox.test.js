const ganache = require('ganache');
const { Web3 } = require('web3');
const assert = require('assert');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

// updated ganache and web3 imports added for convenience

// contract test code will go here

let accounts;
let inbox;

const INITIAL_MESSAGE = "Hi There!";

beforeEach(async () => {
    //get list of all accounts
    accounts = await web3.eth.getAccounts();
    
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi There!'] })
        .send({from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // asserts if value exsists
        assert.ok(inbox.options.address);
    });
    it('has a default message', async () => {
        // call method
        const message = await inbox.methods.message().call();
        assert(message);
    });
    it('sets message', async () => {
        // send transaction
        await inbox.methods.setMessage("test").send({from: accounts[0]});
        const newMessage = await inbox.methods.message().call();
        assert(newMessage != INITIAL_MESSAGE);
    })
});