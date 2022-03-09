const hre = require('hardhat')
const ethers = hre.ethers;

async function deployContract(privateKey) {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const wallet = new ethers.Wallet(privateKey, ethers.provider) // New wallet with the privateKey passed from CLI as param
    const walletBalance = await wallet.getBalance();
    console.log('Deploying contracts with the account:', wallet.address); // We are printing the address of the deployer
    console.log('Account balance:', walletBalance.toString()); // We are printing the account balance

    const LimeToken = await ethers.getContractFactory("LimeToken", wallet); // Get the contract factory with the signer from the wallet created
    const limeTokenContract = await LimeToken.deploy();
    console.log('Waiting for token deployment...');
    
    await limeTokenContract.deployed();
    console.log('LimeToken Contract address: ', limeTokenContract.address);
    console.log('Deployment is done!');

    const tokenBalance = await limeTokenContract.totalSupply();
    console.log('Token balance: ', tokenBalance.toString());
}

async function deployContract2() {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    const tokenBalance = await hardhatToken.totalSupply();

    console.log("Owner address: ", owner.address);
    console.log("Owner balance: ", ownerBalance.toString());
    console.log("Token balance: ", tokenBalance.toString());
}
  
module.exports = deployContract;
//module.exports = deployContract2;