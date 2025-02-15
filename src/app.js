App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        // --laad data--
        return await App.initWeb3();
    },

    initWeb3: async function () {
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


        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Lottery.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            var LotteryArtifact = data;
            App.contracts.Lottery = TruffleContract(LotteryArtifact);

            // Set the provider for our contract
            App.contracts.Lottery.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.showBalance();
        });


        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '#enterBtn', App.enterLottery);
    },

    enterLottery: function (event) {
        console.log("Enter lottery");

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            console.log("Account: ", account);

            App.contracts.Lottery.deployed().then(function (instance) {
                let amount = 1; // 1 ether
                // Execute adopt as a transaction by sending account
                return instance.join({ from: account, value: web3.toWei(amount, 'ether') });

            }).then(function (result) {
                return App.showBalance();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    showBalance: function () {
        App.contracts.Lottery.deployed().then(function (instance) {
            return instance.getBalance.call();
        }).then(function (result) {
            let balance = web3.fromWei(result.toNumber(), 'ether');
            console.log("Balance", balance);
            $("#balance").html(balance);

        }).catch(function (err) {
            console.log(err.message);
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
