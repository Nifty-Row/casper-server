const express = require("express");
const auctionController = require("../controllers/auction.controller");
const router = express.Router();

router.post("/startAuction", auctionController.startAuction);
router.post("/updateAuction", auctionController.updateAuctionHashes);
router.get("/getHashes/:deployHash", auctionController.getHashes);
router.post("/deployBidPurse", auctionController.deployBidPurse);
router.post("/deployAuction", auctionController.deployAuction);
router.post("/deploySigned", auctionController.deploySigned);
router.put("/bidOnAuction", auctionController.addBidOnAuction);
router.put("/openAuction/:auctionId", auctionController.openAuction);
router.put("/closeAuction/:auctionId", auctionController.closeAuction);
router.get("/allAuctions", auctionController.getAllAuctions);
router.get("/getAuctionByNft/:nftId", auctionController.getAuctionByNft);

module.exports = router;
