const { BigNumber } = require('ethers');
const hre = require('hardhat');
const ethers = hre.ethers;

const ETHWrapper = require('../artifacts/contracts/ETHWrapper.sol/ETHWrapper.json');
const WETH = require('../artifacts/contracts/WETH.sol/WETH.json');

const run = async function() {

	const providerURL = "http://localhost:8545";
	const walletPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
	const wrapperContractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

	const provider = new ethers.providers.JsonRpcProvider(providerURL)
	
	const wallet = new ethers.Wallet(walletPrivateKey, provider)

	const wrapperContract = new ethers.Contract(wrapperContractAddress, ETHWrapper.abi, wallet)
	const wethAddress = await wrapperContract.WETHToken();

	console.log("Wrapped token contract address: ", wethAddress);

    const tokenContract = new ethers.Contract(wethAddress, WETH.abi, wallet);

    // Mint(wrap) WETH
    const wrapValue = ethers.utils.parseEther("1");
    console.log("Value to be (un)wrapped: ", wrapValue);

    const wrapTx = await wrapperContract.wrap({value: wrapValue});
    await wrapTx.wait();

    let balance = await tokenContract.balanceOf(wallet.address);
    console.log("Balance after wrapping: ", balance.toString());

    let contractETHBalance = await provider.getBalance(wrapperContractAddress);
    console.log("Contract ETH balance after wrapping: ", contractETHBalance.toString());
	
    // Unwrap WETH
    const approveTx = await tokenContract.approve(wrapperContractAddress, wrapValue);
    await approveTx.wait();
    console.log('Approve done!');
    
    const unwrapTx = await wrapperContract.unwrap(wrapValue);
    await unwrapTx.wait();
    console.log('Unwrap done!');
    
    balance = await tokenContract.balanceOf(wallet.address)
	console.log("Balance after unwrapping:", balance.toString())

	contractETHBalance = await provider.getBalance(wrapperContractAddress);
	console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())
	
}

run();