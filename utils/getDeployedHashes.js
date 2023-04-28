const {
  CasperClient,
  CLPublicKey,
  Keys,
  CasperServiceByJsonRPC,
} = require("casper-js-sdk");
const NODE_URL = "http://135.181.208.231:7777/rpc";

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
async function getDeployedHashes(deployHash) {
  try {
    let contractHash;
    let packageHash;
    const client = new CasperClient(NODE_URL);
    const [deploy, raw] = await client.getDeploy(deployHash);

    if (raw.execution_results.length !== 0) {
      if (raw.execution_results[0].result.Success) {
        const execResultArray =
          raw.execution_results[0].result.Success.effect.transforms;
        execResultArray.forEach(function (item) {
          if (isObject(item)) {
            if (item.transform == "WriteContract") {
              contractHash = item.key;
            }
            if (item.transform == "WriteContractPackage") {
              packageHash = item.key;
            }
          }
        });
        if (contractHash == undefined || packageHash == undefined) {
          return "";
        }

        return { contractHash, packageHash };
      } else {
        throw Error(
          "Contract execution: " +
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      return "";
    }
  } catch (error) {
    console.error("getDeployedHashes: ", error);
    return "";
  }
}

module.exports = getDeployedHashes;
