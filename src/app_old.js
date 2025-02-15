web3 = null;
App = {
    web3Provider: null,
    contracts: {},
}

async function initiWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
            // Request account access
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    initContract();
}
function initContract() {
    $.getJSON('Lottery.json', function (data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var LotteryArtifact = data;
        App.contracts.Lottery = TruffleContract(LotteryArtifact);

        // Set the provider for our contract
        App.contracts.Lottery.setProvider(App.web3Provider);

        // get balance
        showBalance();
    });
    bindEvents();
}

async function showBalance() {
    let lotteryInstance = await App.contracts.Lottery.deployed();
    let balance = await lotteryInstance.getBalance.call();

    console.log("Balance", balance);


    $("#balance").html(balance);
}

async function enterLottery() {
    web3.eth.getAccounts(async function (error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[0];
        console.log("Account: ", account);


        let lotteryInstance = await App.contracts.Lottery.deployed();
        console.log(account);

        let amount = 1;
        await lotteryInstance.join({ from: account, value: web3.utils.toWei(amount, 'ether') });
        showBalance();
    });
}

function bindEvents() {
    $("#enterBtn").on('click', enterLottery);
}

// run code
initiWeb3();
