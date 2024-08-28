# Uniswap V2 Project

This project is a customized implementation of the Uniswap V2 decentralized exchange protocol. It includes smart contracts for the Uniswap V2 protocol and a development environment for testing, deployment, and interaction with these contracts.

## Features

- **Uniswap V2 Core Contracts:** Contains the essential smart contracts for deploying your own version of Uniswap V2.
- **Testing Environment:** A fully set-up Hardhat environment for testing the smart contracts.
- **Forking Mainnet:** Ability to fork the Ethereum mainnet for testing with real-world data.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>=14.x recommended)
- [Hardhat](https://hardhat.org/) - A development environment for Ethereum software.
- [Alchemy API Key](https://www.alchemy.com/) - For forking the Ethereum mainnet.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/uniswapv2_fork.git
   cd uniswapv2_fork
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your Alchemy API key:

   ```sh
   ALCHEMY_API_KEY=your-alchemy-api-key
   ```

## Usage

### Compile the Contracts

To compile the smart contracts, run:

```sh
npx hardhat compile
```

### Run Tests

To run the test suite:

```sh
npx hardhat test
```

### Forking Mainnet

To fork the Ethereum mainnet and test with real data:

```sh
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/your-alchemy-api-key
```

### Deploying Contracts

To deploy the smart contracts to a local network:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

You can also deploy to a testnet like Rinkeby by specifying the network in the command.

## Project Structure

- `contracts/`: Contains the Solidity smart contracts.
- `scripts/`: Contains deployment and other automation scripts.
- `test/`: Contains the test files for the smart contracts.
- `cache/`: Stores Hardhat cache, including the mainnet fork data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
