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
async function getBidPurseUref(deployHash) {
  try {
    let bidPurseInfo = {};
    const client = new CasperClient(NODE_URL);
    const [deploy, raw] = await client.getDeploy(deployHash);

    if (raw.execution_results.length !== 0) {
      if (raw.execution_results[0].result.Success) {
        const execResultArray =
          raw.execution_results[0].result.Success.effect.transforms;
        execResultArray.forEach(function (item) {
          if (isObject(item)) {
            if (item.transform.AddKeys !== undefined) {
              const bidPurse = item.transform.AddKeys;
              if (bidPurse.length > 0) {
                bidPurseInfo.name = bidPurse[0].name;
                bidPurseInfo.uref = bidPurse[0].key;
              }
            }
            if (item.transform.WriteTransfer !== undefined) {
              if (item.transform.WriteTransfer.target == bidPurseInfo.uref) {
                bidPurseInfo.amount = item.transform.WriteTransfer.amount;
              }
            }
          }
        });
        if (bidPurseInfo.uref == undefined || bidPurseInfo.name == undefined) {
          return "";
        }

        return { ...bidPurseInfo };
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
    console.error("getBidPurseUref: ", error);
    return "";
  }
}

module.exports = getBidPurseUref;
