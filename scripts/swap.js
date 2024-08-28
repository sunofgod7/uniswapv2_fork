const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const UNISWAP_V2_ROUTER = "UNISWAP_ROUTER_DEPLOYED_ADDRESS";

  const impersonatedAccount = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [impersonatedAccount],
  });

  const impersonatedSigner = await ethers.getSigner(impersonatedAccount);

  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  const WETH = await ethers.getContractAt(
    "contracts/factory/interfaces/IERC20.sol:IERC20",
    WETH_ADDRESS,
    impersonatedSigner
  );
  const WETH2 = await ethers.getContractAt(
    "contracts/factory/interfaces/IERC20.sol:IERC20",
    WETH_ADDRESS
  );
  const DAI = await ethers.getContractAt(
    "contracts/factory/interfaces/IERC20.sol:IERC20",
    DAI_ADDRESS,
    impersonatedSigner
  );

  const transferAmount = ethers.utils.parseUnits("10", 18);

  await WETH.transfer(deployer.address, transferAmount);
  console.log(
    `Transferred ${ethers.utils.formatUnits(transferAmount, 18)} WETH to ${
      deployer.address
    }`
  );

  await DAI.transfer(deployer.address, transferAmount);
  console.log(
    `Transferred ${ethers.utils.formatUnits(transferAmount, 18)} DAI to ${
      deployer.address
    }`
  );

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [impersonatedAccount],
  });

  const amountIn = ethers.utils.parseUnits("1", 18);

  const UniswapV2Router = await ethers.getContractAt(
    "IUniswapV2Router02",
    UNISWAP_V2_ROUTER
  );

  await WETH2.approve(UNISWAP_V2_ROUTER, amountIn);
  console.log(
    `Approved ${ethers.utils.formatUnits(amountIn, 18)} WETH for swapping`
  );
  const balance = await WETH.balanceOf(deployer.address);
  console.log("Token balance:", ethers.utils.formatUnits(balance, 18));
  const allowance = await WETH.allowance(deployer.address, UNISWAP_V2_ROUTER);
  console.log("Token allowance:", ethers.utils.formatUnits(allowance, 18));

  const amountOutMin = 0;
  const path = [WETH_ADDRESS, DAI_ADDRESS];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const tx = await UniswapV2Router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    deployer.address,
    deadline
  );

  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Swap completed in block", receipt.blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
