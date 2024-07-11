# dapp-lottery

A Lottery DApp with NextJs, Solidity

# Running the demo

To run the demo follow these steps:

1. Clone the project with the code below.

   ```sh
   # Make sure you have the above prerequisites installed already!
   git clone https://github.com/minjie05/dapp-lottery.git dapp-lottery
   cd dapp-lottery # Navigate to the new folder.
   yarn install # Installs all the dependencies.
   ```

2. Start a node on the local network.

```
yarn hardhat node
```

3. Run the app using `yarn dev`

```
npx hardhat compile
npx hardhat run scripts/deploy.js
yarn dev
```

4. open `http://localhost:3000/`
