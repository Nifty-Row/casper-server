const express = require("express");
const auctionController = require("../controllers/auction.controller");
const router = express.Router();

router.post("/startAuction", auctionController.startAuction);
router.post("/deployAuction", auctionController.deployAuction);
router.post("/deploySigned", auctionController.deploySigned);
router.put("/bidOnAuction", auctionController.addBidOnAuction);
router.get("/allAuctions", auctionController.getAllAuctions);

module.exports = router;
