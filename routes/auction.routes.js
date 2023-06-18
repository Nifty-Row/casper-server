const express = require("express");
const auctionController = require("../controllers/auction.controller");
const router = express.Router();

router.post("/startAuction", auctionController.startAuction);
router.get("/getHashes/:deployHash", auctionController.getHashes);
router.post("/deployBidPurse", auctionController.deployBidPurse);
router.post("/deployAuction", auctionController.deployAuction);
router.post("/deploySigned", auctionController.deploySigned);
router.put("/bidOnAuction", auctionController.addBidOnAuction);
router.get("/allAuctions", auctionController.getAllAuctions);

module.exports = router;
