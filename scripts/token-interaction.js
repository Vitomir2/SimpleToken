const { BigNumber } = require('ethers');
const hre = require('hardhat');
const ethers = hre.ethers;

const LimeToken = require('../artifacts/contracts/LimeToken.sol/LimeToken.json');

const run = async function() {
    console.log("Interaction script is starting...");
    console.log("ethers version: ", ethers.version);

    // Check if the provider is working
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    // const latestBlock = await provider.getBlock("latest");
    // console.log("Latest block: ", latestBlock);

    const contractAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const contractABI = LimeToken.abi;
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const mainWalletBal = await wallet.getBalance();
    const mainWalletAddr = await wallet.getAddress();
    console.log(mainWalletAddr + " balance is: " + ethers.utils.formatEther(mainWalletBal, 18));

    const limeTokenContract = new ethers.Contract(contractAddr, contractABI, wallet);
    console.log("Contract address: ", limeTokenContract.address);
    console.log("Deployer address: ", wallet.address);

    const contractTotalSupply = await limeTokenContract.totalSupply();
    console.log("Contract total supply: ", contractTotalSupply);

    let deployerBalance = await limeTokenContract.balanceOf(wallet.address);
    console.log("Deployer balances: ", BigNumber.from(deployerBalance).toString());

    const receiverAddr = "0x465b2b6CC578268BA33f24A7e151D144b0E44D29";
    let receiverBalance = await limeTokenContract.balanceOf(receiverAddr);
    console.log("Receiver balances: ", BigNumber.from(receiverBalance).toString());

    let tokenTotalSupply = await limeTokenContract.totalSupply();
    console.log("Contract total supply: ", BigNumber.from(tokenTotalSupply).toString());

    // Mint 2 LMT tokens
    let transaction = await limeTokenContract.mint(wallet.address, BigNumber.from("2000000000000000000")); // try to find how to convert 2 into 2000...
    let transactionReceipt = await transaction.wait();
    if (transactionReceipt.status == 1) {
        console.log("Minted successfully.");

        deployerBalance = await limeTokenContract.balanceOf(wallet.address);
        console.log("Deployer updated balances: ", BigNumber.from(deployerBalance).toString());
    } else {
        console.log("Minting failed...");
    }

    tokenTotalSupply = await limeTokenContract.totalSupply();
    console.log("Contract total supply: ", BigNumber.from(tokenTotalSupply).toString());

    // Transfer LMT to another address
    transaction = await limeTokenContract.transfer(receiverAddr, BigNumber.from("1430000000000000000"));
    transactionReceipt = await transaction.wait();
    if (transactionReceipt.status == 1) {
        console.log("Successfully transferred.");

        receiverBalance = await limeTokenContract.balanceOf(receiverAddr);
        console.log("Receiver updated balances: ", BigNumber.from(receiverBalance).toString());

        deployerBalance = await limeTokenContract.balanceOf(wallet.address);
        console.log("Sender updated balances: ", BigNumber.from(deployerBalance).toString());
    } else {
        console.log("Transfer failed...");
    }

    // Burn the remaining tokens of the deployer
    transaction = await limeTokenContract.burn(deployerBalance);
    transactionReceipt = await transaction.wait();
    if (transactionReceipt.status == 1) {
        console.log("Successfully burned.");

        const balance = await limeTokenContract.balanceOf(wallet.address);
        console.log("Deployer updated balances: ", BigNumber.from(balance).toString());
    } else {
        console.log("Burn failed...");
    }

    tokenTotalSupply = await limeTokenContract.totalSupply();
    console.log("Contract total supply: ", BigNumber.from(tokenTotalSupply).toString());
}

run();