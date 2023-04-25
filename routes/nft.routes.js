const express = require("express");
const nftController = require("../controllers/nft.controller");
const router = express.Router();

router.post("/addNft", nftController.addNft);
router.get("/allNfts", nftController.getAllNfts);
router.get("/nftsInAuction", nftController.getAllNftsInAuction);
router.get("/:tokenId", nftController.getNftByTokenId);
router.put("/updateOwner/:tokenId", nftController.updateOwner);
router.delete("/remove/:tokenId", nftController.removeNFT);

module.exports = router;
