const { ethers } = require("hardhat");

async function main() {
  const UNISWAP_ROUTER_ADDRESS = "UNISWAP_ROUTER_DEPLOYED_ADDRESS";
  const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const [deployer] = await ethers.getSigners();

  const uniswapRouterABI = [
    "function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable returns (uint256[] memory amounts)",
    "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)",
  ];

  const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const uniswapRouter = new ethers.Contract(
    UNISWAP_ROUTER_ADDRESS,
    uniswapRouterABI,
    deployer
  );

  const WETH = new ethers.Contract(WETH_ADDRESS, erc20ABI, deployer);
  const USDT = new ethers.Contract(USDT_ADDRESS, erc20ABI, deployer);

  const amountInETH = ethers.utils.parseEther("1");
  const amountOutMinWETH = ethers.utils.parseUnits("0.5", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log("Swapping ETH for WETH...");
  const txWETH = await uniswapRouter.swapExactETHForTokens(
    amountOutMinWETH,
    [ethers.constants.AddressZero, WETH_ADDRESS],
    deployer.address,
    deadline,
    { value: amountInETH }
  );
  await txWETH.wait();
  console.log("Swapped ETH for WETH");

  const wethBalance = await WETH.balanceOf(deployer.address);

  const amountOutMinUSDT = ethers.utils.parseUnits("100", 6);

  console.log("Swapping ETH for USDT...");
  const txUSDT = await uniswapRouter.swapExactETHForTokens(
    amountOutMinUSDT,
    [ethers.constants.AddressZero, WETH_ADDRESS, USDT_ADDRESS],
    deployer.address,
    deadline,
    { value: amountInETH }
  );
  await txUSDT.wait();
  console.log("Swapped ETH for USDT");

  const usdtBalance = await USDT.balanceOf(deployer.address);

  console.log("Approving Uniswap Router to spend WETH and USDT...");
  await WETH.approve(UNISWAP_ROUTER_ADDRESS, wethBalance);
  await USDT.approve(UNISWAP_ROUTER_ADDRESS, usdtBalance);

  console.log("Adding liquidity to Uniswap...");
  const txAddLiquidity = await uniswapRouter.addLiquidity(
    WETH_ADDRESS,
    USDT_ADDRESS,
    wethBalance,
    usdtBalance,
    0,
    0,
    deployer.address,
    deadline
  );
  await txAddLiquidity.wait();
  console.log("Liquidity added to Uniswap");

  console.log("Script completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
