const db = require("../models");

// Get the model
const Nfts = db.nfts;

async function generateMediaUrls(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Medial file not uploaded.");
    }
    const mediaType = req.body.mediaType.toLowerCase();

    if (mediaType == "artwork") {
      const artUrl = await uploadToCloudinary(req.files.artFile);
      if (artUrl == "") {
        return res.status(500).send("An error occurred.");
      }
      return res.status(200).json({ artworkUrl: artUrl });
    } else if (mediaType == "music") {
      const thumbUrl = await uploadToCloudinary(req.files.musicThumbnail);
      const fileUrl = await uploadToCloudinary(req.files.musicFile);
      if (thumbUrl == "" || fileUrl == "") {
        return res.status(500).send("An error occurred.");
      }
      return res.status(200).json({ thumbnailUrl: thumbUrl, fileUrl: fileUrl });
    } else if (mediaType == "movie") {
      const thumbUrl = await uploadToCloudinary(req.files.movieThumbnail);
      const fileUrl = await uploadToCloudinary(req.files.movieFile);
      if (thumbUrl == "" || fileUrl == "") {
        return res.status(500).send("An error occurred.");
      }
      return res.status(200).json({ thumbnailUrl: thumbUrl, fileUrl: fileUrl });
    } else {
      return res.status(400).send("Invalid media type.");
    }
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

// When NFT is minted, this controller is used to add it
// to the off-chain server
// mediaType = artwork | music | movie
async function addNft(req, res) {
  try {
    const mediaType = req.body.mediaType.toLowerCase();

    const newNft = {
      tokenId: req.body.tokenId,
      deployerKey: req.body.deployerKey,
      ownerKey: req.body.ownerKey,
      mediaType: mediaType,
      mediaName: req.body.mediaName,
      description: req.body.description,
      socialMediaLink: req.body.socialMediaLink,
      tokenHash: req.body.tokenHash,
      assetSymbol: req.body.assetSymbol,
      assetType: req.body.assetType,
    };

    if (mediaType == "artwork") {
      newNft.artworkUrl = req.body.artworkUrl;
    } else if (mediaType == "music") {
      newNft.musicThumbnailUrl = req.body.musicThumbnailUrl;
      newNft.musicFileUrl = req.body.musicFileUrl;
    } else if (mediaType == "movie") {
      newNft.movieThumbnailUrl = req.body.movieThumbnailUrl;
      newNft.movieFileUrl = req.body.movieFileUrl;
    } else {
      return res.status(400).send("Invalid media type.");
    }

    if (req.body.assetType.toLowerCase() == "physical") {
      newNft.artistName = req.body.artistName;
      newNft.medium = req.body.medium;
      newNft.year = req.body.year;
      newNft.size = req.body.size;
    }

    const createdNft = await Nfts.create(newNft);
    return res.status(200).json({ nft: createdNft });
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function getAllNfts(req, res) {
  try {
    const foundNfts = await Nfts.findAll({});
    return res.status(200).send(foundNfts);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function getNftByTokenId(req, res) {
  try {
    const tokenId = req.params.tokenId;

    const foundNft = await Nfts.findOne({ where: { tokenId: tokenId } });
    return res.status(200).send(foundNft);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function getNftsByOwner(req, res) {
  try {
    const ownerKey = req.params.ownerKey;

    const foundNfts = await Nfts.findAll({ where: { ownerKey: ownerKey } });
    return res.status(200).send(foundNfts);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function getAllNftsInAuction(req, res) {
  try {
    const foundNfts = await Nfts.findAll({ where: { inAuction: true } });
    return res.status(200).send(foundNfts);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function updateOwner(req, res) {
  try {
    const tokenId = req.params.tokenId;
    const newOwnerKey = req.body.newOwnerKey;

    const updatedNft = await Nfts.update(
      { ownerKey: newOwnerKey },
      {
        where: { tokenId: tokenId },
      }
    );
    return res.status(200).send(updatedNft);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function removeNFT(req, res) {
  try {
    const tokenId = req.params.tokenId;

    await Nfts.destroy({ where: { tokenId: tokenId } });
    return res.status(200).send("NFT removed successfully.");
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

module.exports = {
  generateMediaUrls,
  addNft,
  getAllNfts,
  getAllNftsInAuction,
  getNftByTokenId,
  getNftsByOwner,
  updateOwner,
  removeNFT,
};
