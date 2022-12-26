# Basic Sample Hardhat Typescript Project

### Run node and export ABIs

```
yarn hardhat node --export ../client/src/deployments.json --network localhost
```

Use `FORK=mainnet` to fork mainnet on the localhost network.

### Tests

```
npx hardhat test
```

### Deployment

```
npx hardhat deploy
```

### Generate types

```
npx hardhat typechain
```

### Development

For live view of the token for development run

```
yarn live
```

To generate 255 tokens for QA run

```
yarn qa
```
