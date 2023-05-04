const { Keys } = require("casper-js-sdk");

function getKeyPairOfContract(pathToFaucet) {
  return Keys.Ed25519.loadKeyPairFromPrivateFile(
    `${pathToFaucet}/secret_key.pem`
  );
}

module.exports = getKeyPairOfContract;
