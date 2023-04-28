// Casper
const { CasperServiceByJsonRPC, DeployUtil } = require("casper-js-sdk");
const confirmDeploy = require("../utils/confirmDeploy");
const getDeployedHashes = require("../utils/getDeployedHashes");
const client = new CasperServiceByJsonRPC("http://3.136.227.9:7777/rpc");

// Get the models
const db = require("../models");
const Auctions = db.auctions;

// When an auction is initialized, this controller is
// called to update the off-chain server
async function startAuction(req, res) {
  try {
    const newAuction = {
      nftId: req.body.nftId,
      deployerKey: req.body.deployerKey,
      contractHash: req.body.contractHash,
      packageHash: req.body.packageHash,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      sellNowPrice: req.body.sellNowPrice,
      minimumPrice: req.body.minimumPrice,
      approved: false,
    };

    const createdAuction = await Auctions.create(newAuction);
    return res.status(200).send(createdAuction);
  } catch (error) {
    return res.status(500).send("An error occurred");
  }
}

async function addBidOnAuction(req, res) {
  try {
    const auctionId = req.params.auctionId;
    const bid = req.body.bid;
    const bidder = req.body.bidder;

    const update = await Auctions.update(
      { bids: bid, bidders: bidder },
      { where: { auctionId: auctionId } }
    );
    return res.status(200).send(update);
  } catch (error) {
    return res.status(500).send("An error occurred");
  }
}

async function getAllAuctions(req, res) {
  try {
    const foundAuctions = await Auctions.findAll({});
    return res.status(200).send(foundAuctions);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function deployAuction(req, res) {
  try {
    const signedDeployJSON = req.body.signedDeployJSON;

    const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const { deployHash } = await client.deploy(signedDeploy);
    const result = await confirmDeploy(deployHash);

    const hashes = await getDeployedHashes(deployHash);
    if (hashes == "") {
      return res.status(500).send("Error in getting hashes");
    }

    return res.status(200).json({ deployHash, hashes });
  } catch (error) {
    return res.status(500).send("Error deploying on-chain");
  }
}

// Blockchain deploys
async function deploySigned() {
  try {
    const signedDeployJSON = req.body.signedDeployJSON;

    const deploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const deployHash = await client.putDeploy(deploy);
    const result = await confirmDeploy(deployHash);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error deploying on-chain");
  }
}

module.exports = {
  startAuction,
  addBidOnAuction,
  getAllAuctions,
  deployAuction,
  deploySigned,
};
