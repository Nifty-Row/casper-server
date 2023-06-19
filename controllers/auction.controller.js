// Casper
const {
  CasperServiceByJsonRPC,
  DeployUtil,
  Contracts,
} = require("casper-js-sdk");
const confirmDeploy = require("../utils/confirmDeploy");
const getDeployedHashes = require("../utils/getDeployedHashes");
const client = new CasperServiceByJsonRPC("http://3.136.227.9:7777/rpc");
const contract = new Contracts.Contract(client);

// Get the models
const db = require("../models");
const Auctions = db.auctions;
const Bids = db.bids;

// When an auction is initialized, this controller is
// called to update the off-chain server
async function startAuction(req, res) {
  try {
    const newAuction = {
      nftId: req.body.nftId,
      userId: req.body.userId,
      deployerKey: req.body.deployerKey,
      deployHash: req.body.deployHash,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      minimumPrice: req.body.minimumPrice,
      approved: false,
    };

    const createdAuction = await Auctions.create(newAuction);
    return res.status(200).send(createdAuction);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred");
  }
}
async function updateAuctionHashes(req, res) {
  try {
    const deployHash = req.body.deployHash;
    const packageHash = req.body.packageHash;
    const contractHash = req.body.contractHash;

    const auction = await Auctions.findOne({
      where: { deployHash: deployHash },
    });
    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    auction.packageHash = packageHash;
    auction.contractHash = contractHash;

    const updatedAuction = await auction.save();
    return res.status(200).send(updatedAuction);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred" + JSON.stringify(error));
  }
}

async function addBidOnAuction(req, res) {
  try {
    const auctionId = req.params.auctionId;

    const bid = req.body.bid;
    const bidder = req.body.bidder;
    const userId = req.body.userId;

    // Check if bidder has already bidded
    const foundBid = await Bids.findOne({ where: { auctionId, bidder } });
    if (foundBid == null) {
      const newBid = {
        auctionId,
        bid,
        bidder,
        userId,
      };
      const createdBid = await Bids.create(newBid);
      return res.status(200).send("Bid added successfully");
    } else {
      foundBid.bid = bid;
      await foundBid.save();
      return res.status(200).send("Bid updated successfully");
    }
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred");
  }
}

async function getAllAuctions(req, res) {
  try {
    const foundAuctions = await Auctions.findAll({
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundAuctions);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}
async function getAuctionByNft(req, res) {
  const nftId = req.params.nftId;
  try {
    const foundAuctions = await Auctions.findOne({
      where: {
        nftId: nftId,
      },
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundAuctions);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function deployBidPurse(req, res) {
  try {
    const signedDeployJSON = req.body.signedDeployJSON;
    console.info("signedDeployJSON: ", signedDeployJSON);

    const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const { deployHash } = await client.deploy(signedDeploy);
    const result = await confirmDeploy(deployHash);
    console.info("deployHash: ", deployHash);

    // const hashes = await getDeployedHashes(deployHash);
    // if (hashes == "") {
    //   return res.status(500).send("Error in getting hashes");
    // }
    // contract.setContractHash(hashes.contractHash);
    // const bidPurse = await contract.queryContractData(["---here----"]);

    return res.status(200).json({ deployHash });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error deploying BidPurse on-chain");
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
    const newAuction = {
      nftId: req.body.nftId,
      deployerKey: req.body.deployerKey,
      contractHash: hashes.contractHash,
      packageHash: hashes.packageHash,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      minimumPrice: req.body.minimumPrice,
      approved: true,
    };
    await Auctions.create(newAuction);

    return res.status(200).json({ deployHash, hashes });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error deploying Auction on-chain");
  }
}

async function getHashes(req, res) {
  try {
    const deployedHash = req.params.deployHash;
    const result = await confirmDeploy(deployedHash);

    const hashes = await getDeployedHashes(deployedHash);
    if (result == "") {
      return res.status(500).send("Error in getting hashes");
    }
    return res.status(200).json({ hashes });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error fetching result :" + JSON.stringify(error));
  }
}

// Blockchain deploys
async function deploySigned(req, res) {
  try {
    const signedDeployJSON = req.body.signedDeployJSON;

    const deploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const deployHash = await client.putDeploy(deploy);
    const result = await confirmDeploy(deployHash);

    res.status(200).send(deployHash);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deploying on-chain");
  }
}

module.exports = {
  getHashes,
  startAuction,
  updateAuctionHashes,
  getAuctionByNft,
  addBidOnAuction,
  getAllAuctions,
  deployBidPurse,
  deployAuction,
  deploySigned,
};
