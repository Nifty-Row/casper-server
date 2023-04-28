const {
  CasperClient,
  CLPublicKey,
  Keys,
  CasperServiceByJsonRPC,
} = require("casper-js-sdk");

const NODE_URL = "http://76.91.193.251:7777/rpc";
async function confirmDeploy(deployHash) {
  const client = new CasperClient(NODE_URL);
  let i = 300;
  while (i != 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      if (raw.execution_results[0].result.Success) {
        return deploy;
      } else {
        throw Error(
          "Contract execution: " +
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
}

module.exports = confirmDeploy;
