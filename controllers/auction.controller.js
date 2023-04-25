// Casper
const {
  CasperServiceByJsonRPC,
  DeployUtil,
  EventStream,
  EventName,
  CLValueParsers,
  CLMap,
  CLValueBuilder,
  CLPublicKey,
} = require("casper-js-sdk");
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
    const { deploy_hash } = await client.deploy(signedDeploy);
    console.log("deploy_hash is: ", deploy_hash);

    return res.status(200).send(deploy_hash);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

module.exports = {
  startAuction,
  addBidOnAuction,
  getAllAuctions,
  deployAuction,
};
