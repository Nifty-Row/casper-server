const express = require("express");
const auctionController = require("../controllers/auction.controller");
const router = express.Router();

router.post("/startAuction", auctionController.startAuction);
router.post("/updateAuction", auctionController.updateAuctionHashes);
router.post("/deployBidPurse", auctionController.deployBidPurse);
router.post("/saveBidPurseInfo", auctionController.saveBidPurseInfo);
router.post("/deployAuction", auctionController.deployAuction);
router.post("/deploySigned", auctionController.deploySigned);
router.get("/getHashes/:deployHash", auctionController.getHashes);
router.get("/allAuctions", auctionController.getAllAuctions);
router.get("/getAuctionByNft/:nftId", auctionController.getAuctionByNft);
router.get("/getPurseInfo/:deployHash", auctionController.getPurseInfo);
router.put("/bidOnAuction", auctionController.addBidOnAuction);
router.put("/openAuction/:auctionId", auctionController.openAuction);
router.put("/closeAuction/:auctionId", auctionController.closeAuction);
router.put("/purse/:purseId", auctionController.updatePurseUref);
router.delete("/purse/:purseId", auctionController.deletePurse);

module.exports = router;
