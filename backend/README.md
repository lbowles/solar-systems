# Basic Sample Hardhat Typescript Project
### Run node
```
npx hardhat node
```
Optionally export ABIs:
```
npx hardhat deploy --export ../client/src/deployments.json --network localhost
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
