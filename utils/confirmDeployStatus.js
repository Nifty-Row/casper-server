const {
  CasperClient,
  CLPublicKey,
  Keys,
  CasperServiceByJsonRPC,
} = require("casper-js-sdk");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const NODE_URL = "https://rpc.testnet.casperlabs.io/rpc";

async function confirmDeployStatus(deployHash) {
  const client = new CasperClient(NODE_URL);
  let i = 300;
  while (i != 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      const result = raw.execution_results[0].result;
      return result;

      // if (raw.execution_results[0].result.Success) {
      //   return deploy;
      // } else {
      //   throw Error(
      //     "Contract execution: " +
      //       raw.execution_results[0].result.Failure.error_message
      //   );
      // }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
}

module.exports = confirmDeployStatus;
