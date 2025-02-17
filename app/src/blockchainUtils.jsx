import { ethers } from "ethers";

const contractAddress = "0xa873271e7f0e84f6Def7EeC0d701b37C2E6E4Aea"; // Replace with your contract address
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "manager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "members",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "winner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "join",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const connectWallet = async () => {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return provider.getSigner();
    } catch (error) {
        console.error("MetaMask connection error:", error);
        return null;
    }
};

export const getContract = (signer) => {
    return new ethers.Contract(contractAddress, abi, signer);
};

export const callContractFunction = async () => {
    const signer = await connectWallet();
    if (!signer) return;

    const contract = getContract(signer);

    try {
        const result = await contract.getBalance(); // Example for reading
        console.log("Read result:", ethers.utils.formatEther(result));

        const tx = await contract.join({
            value: ethers.utils.parseEther("1.0"), // Send 1 ETH
        });
        await tx.wait();
        console.log("Transaction completed!");
    } catch (error) {
        console.error("Contract interaction error:", error);
    }
};
