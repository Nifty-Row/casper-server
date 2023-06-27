// Casper
const {
  CasperServiceByJsonRPC,
  DeployUtil,
  Contracts,
} = require("casper-js-sdk");
const confirmDeploy = require("../utils/confirmDeploy");
const getDeployedHashes = require("../utils/getDeployedHashes");
const findHighestBidder = require("../utils/findHighestBidder");
const client = new CasperServiceByJsonRPC("http://3.136.227.9:7777/rpc");
const contract = new Contracts.Contract(client);

// Get the models
const db = require("../models");
const getBidPurseUref = require("../utils/getBidPurseUref");
const Auctions = db.auctions;
const Nfts = db.nfts;
const Bids = db.bids;
const Purses = db.purses;

// When an auction is initialized, this controller is
// called to update the off-chain server
async function startAuction(req, res) {
  try {
    const tokenId = req.body.tokenId;

    const foundNft = await Nfts.findOne({ where: { tokenId } });
    if (foundNft == null) {
      return res.status(400).send("NFT not found");
    }
    if (foundNft.inAuction == true) {
      return res.status(400).send("NFT already in another live auction");
    }
    const newAuction = {
      tokenId,
      nftId: req.body.nftId,
      userId: req.body.userId,
      deployerKey: req.body.deployerKey,
      deployHash: req.body.deployHash,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      minimumPrice: req.body.minimumPrice,
      approved: false,
      status: "pending",
    };

    const createdAuction = await Auctions.create(newAuction);
    foundNft.auctionId = createdAuction.id;
    foundNft.inAuction = true;
    await foundNft.save();

    return res.status(200).send(createdAuction);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred");
  }
}

async function openAuction(req, res) {
  try {
    const auctionId = req.params.auctionId;
    const foundAuction = await Auctions.findOne({ where: { id: auctionId } });
    if (foundAuction == null) {
      return res.status(404).send("Auction not found");
    }
    foundAuction.status = "open";
    await foundAuction.save();
    return res.status(200).send(`Auction ${auctionId} opened`);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred");
  }
}

async function closeAuction(req, res) {
  try {
    const auctionId = req.params.auctionId;
    const foundAuction = await Auctions.findOne({ where: { id: auctionId } });
    if (foundAuction == null) {
      return res.status(404).send("Auction not found");
    }
    const foundBids = await Bids.findAll({ where: { auctionId } });
    const foundNft = await Nfts.findOne({
      where: { tokenId: foundAuction.tokenId },
    });

    if (foundBids.length > 0) {
      // Find highest bidder
      const highestBidder = findHighestBidder(foundBids);

      if (foundNft == null) {
        return res.status(404).send("Auction has invalid NFT");
      }
      // Update auction NFT owner
      foundNft.ownerKey = highestBidder.bidder;
    }

    foundNft.inAuction = false;
    foundAuction.status = "close";

    await foundNft.save();
    await foundAuction.save();
    return res.status(200).send(`Auction ${auctionId} closed`);
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

async function saveBidPurseInfo(req, res) {
  try {
    // const uref = req.body.uref;
    const name = req.body.name;
    const deployHash = req.body.deployHash;
    const deployerKey = req.body.deployerKey;
    const userId = req.body.userId;
    const amount = req.body.amount;
    const newPurse = {
      name,
      deployHash,
      deployerKey,
      userId,
      amount,
    };
    const createdPurse = await Purses.create(newPurse);
    return res.status(200).send(createdPurse);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
}

async function updatePurseUref(req, res) {
  try {
    const purseId = req.params.purseId;
    const foundPurse = await Purses.findOne({ where: { id: purseId } });
    if (foundPurse == null) {
      return res.status(404).send("Purse not found");
    }
    foundPurse.uref = req.body.uref;
    const savedPurse = await foundPurse.save();
    return res.status(200).send(savedPurse);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
}

async function deletePurse(req, res) {
  try {
    const purseId = req.params.purseId;
    await Purses.destroy({ where: { id: purseId } });
    return res.status(200).send("Bid purse deleted successfully.");
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

async function getPurseInfo(req, res) {
  try {
    const deployHash = req.params.deployHash;
    const purseInfo = await getBidPurseUref(deployHash);
    if (purseInfo == "") {
      return res.status(400).send("No purse found");
    }
    return res.status(200).send(purseInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
}

async function deleteAuction(req, res) {
  try {
    const auctionId = req.params.auctionId;
    await Auctions.destroy({ where: { id: auctionId } });
    const foundNft = await Nfts.findOne({ where: { auctionId } });
    if (foundNft !== null) {
      foundNft.inAuction = false;
      await foundNft.save();
    }
    return res.status(200).send("Auction deleted successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
}

// Blockchain deploys
async function deployBidPurse(req, res) {
  try {
    const signedDeployJSON = req.body.signedDeployJSON;

    const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const { deployHash } = await client.deploy(signedDeploy);
    // const result = await confirmDeploy(deployHash);

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
    const tokenId = req.body.tokenId;
    const foundNft = await Nfts.findOne({ where: { tokenId } });
    if (foundNft == null) {
      return res.status(400).send("NFT not found");
    }
    if (foundNft.inAuction == true) {
      return res.status(400).send("NFT already in another live auction");
    }

    const signedDeployJSON = req.body.signedDeployJSON;

    const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const { deployHash } = await client.deploy(signedDeploy);
    // const result = await confirmDeploy(deployHash);

    // const hashes = await getDeployedHashes(deployHash);
    // if (hashes == "") {
    //   return res.status(500).send("Error in getting hashes");
    // }

    return res.status(200).json({ deployHash });
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
  startAuction,
  openAuction,
  closeAuction,
  updateAuctionHashes,
  addBidOnAuction,
  saveBidPurseInfo,
  updatePurseUref,
  deletePurse,
  getHashes,
  getAuctionByNft,
  getPurseInfo,
  getAllAuctions,
  deleteAuction,
  deployBidPurse,
  deployAuction,
  deploySigned,
};
