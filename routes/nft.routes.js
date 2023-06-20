const express = require("express");
const nftController = require("../controllers/nft.controller");
const router = express.Router();

router.post("/generateMediaUrls", nftController.generateMediaUrls);
router.post("/addNft", nftController.addNft);
router.post("/grantMinter", nftController.grantMinter);
router.post("/deploySigned", nftController.deploySigned);
router.get("/allNfts", nftController.getAllNfts);
router.get("/confirmDeploy/:deployHash", nftController.confirmDeployment);
router.get("/nftsByOwner/:ownerKey", nftController.getNftsByOwner);
router.get("/nftsInAuction", nftController.getAllNftsInAuction);
router.get("/media/:type", nftController.getNftsOfMediaType);
router.get("/asset/:type", nftController.getNftsOfAssetType);
router.get("/:tokenId", nftController.getNftByTokenId);
router.put("/updateOwner/:tokenId", nftController.updateOwner);
router.delete("/remove/:tokenId", nftController.removeNFT);

module.exports = router;
