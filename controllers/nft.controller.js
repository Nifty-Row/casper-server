const {
  DeployUtil,
  CasperClient,
  RuntimeArgs,
  CLValueBuilder,
  CLMap,
  CLList,
  CLKey,
  CLPublicKey,
  CLAccountHash,
  CLString,
  CLOption,
} = require("casper-js-sdk");
const path = require("path");
const db = require("../models");
const uploadToCloudinary = require("../utils/uploadMedia");
const moveFile = require("../utils/moveFile");
const confirmDeploy = require("../utils/confirmDeploy");
const getDeployedHashes = require("../utils/getDeployedHashes");
const getKeyPairOfContract = require("../utils/getKeyPairOfContract");
const confirmDeployStatus = require("../utils/confirmDeployStatus");

// Initialize Casper client
const NODE_URL = "https://rpc.testnet.casperlabs.io/rpc";
const client = new CasperClient(NODE_URL);

// Get the models
const Nfts = db.nfts;
const Users = db.users;
const Auctions = db.auctions;

async function generateMediaUrls(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Media file not uploaded.");
    }
    const mediaType = req.body.mediaType.toLowerCase();

    if (mediaType == "artwork") {
      const artFile = req.files.artFile;
      const artworkLocation = path.join(
        __dirname,
        "..",
        "uploads",
        artFile.name
      );
      const moveRes = await moveFile(artFile, artworkLocation);
      if (!moveRes) {
        return res.status(500).send("Error in moving file");
      }
      const artUrl = await uploadToCloudinary(artworkLocation);
      if (artUrl == "") {
        return res.status(500).send("File storage error.");
      }
      return res.status(200).json({ artworkUrl: artUrl });
    } else if (mediaType == "music") {
      const musicThumbnail = req.files.musicThumbnail;
      const musicFile = req.files.musicFile;

      const thumbLocation = path.join(
        __dirname,
        "..",
        "uploads",
        musicThumbnail.name
      );
      const fileLocation = path.join(
        __dirname,
        "..",
        "uploads",
        musicFile.name
      );
      const thumbMoveRes = await moveFile(musicThumbnail, thumbLocation);
      const fileMoveRes = await moveFile(musicFile, fileLocation);
      if (!thumbMoveRes || !fileMoveRes) {
        return res.status(500).send("Error in moving file");
      }
      const thumbUrl = await uploadToCloudinary(thumbLocation);
      const fileUrl = await uploadToCloudinary(fileLocation);
      if (thumbUrl == "" || fileUrl == "") {
        return res.status(500).send("File storage error.");
      }
      return res.status(200).json({ thumbnailUrl: thumbUrl, fileUrl: fileUrl });
    } else if (mediaType == "movie") {
      const movieThumbnail = req.files.movieThumbnail;
      const movieFile = req.files.movieFile;

      const thumbLocation = path.join(
        __dirname,
        "..",
        "uploads",
        movieThumbnail.name
      );
      const fileLocation = path.join(
        __dirname,
        "..",
        "uploads",
        movieFile.name
      );
      const thumbMoveRes = await moveFile(movieThumbnail, thumbLocation);
      const fileMoveRes = await moveFile(movieFile, fileLocation);
      if (!thumbMoveRes || !fileMoveRes) {
        return res.status(500).send("Error in moving file");
      }
      const thumbUrl = await uploadToCloudinary(thumbLocation);
      const fileUrl = await uploadToCloudinary(fileLocation);
      if (thumbUrl == "" || fileUrl == "") {
        return res.status(500).send("File storage error.");
      }
      return res.status(200).json({ thumbnailUrl: thumbUrl, fileUrl: fileUrl });
    } else {
      return res.status(400).send("Invalid media type.");
    }
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred." + JSON.stringify(error));
  }
}

// When NFT is minted, this controller is used to add it
// to the off-chain server
// mediaType = artwork | music | movie
async function addNft(req, res) {
  try {
    const mediaType = req.body.mediaType.toLowerCase();
    const assetType = req.body.assetType.toLowerCase();
    const deployerKey = req.body.deployerKey;

    const newNft = {
      tokenId: req.body.tokenId,
      deployerKey: deployerKey,
      userId: req.body.userId,
      ownerKey: req.body.ownerKey,
      mediaType: mediaType,
      mediaName: req.body.mediaName,
      description: req.body.description,
      socialMediaLink: req.body.socialMediaLink,
      tokenHash: req.body.tokenHash,
      assetSymbol: req.body.assetSymbol,
      assetType: assetType,
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

    if (assetType == "physical") {
      newNft.artistName = req.body.artistName;
      newNft.medium = req.body.medium;
      newNft.year = req.body.year;
      newNft.size = req.body.size;
    }

    const foundUser = await Users.findOne({
      where: { publicKey: deployerKey },
    });
    if (foundUser == null) {
      const newUser = {
        publicKey: deployerKey,
        category: assetType == "physical" ? "Gallery" : "Creator",
      };
      await Users.create(newUser);
    } else {
      foundUser.category = assetType == "physical" ? "Gallery" : "Creator";
      await foundUser.save();
    }

    const createdNft = await Nfts.create(newNft);
    return res.status(200).json({ nft: createdNft });
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getAllNfts(req, res) {
  try {
    const foundNfts = await Nfts.findAll({
      include: { all: true, nested: true },
    });

    // BidPurse deployHash = fedd723f57592b53bba63e5632d2f5b048d09967099f225b9ec66d5411910cd0
    // const hashes = await getDeployedHashes(
    //   "fedd723f57592b53bba63e5632d2f5b048d09967099f225b9ec66d5411910cd0"
    // );

    return res.status(200).send(foundNfts);
    // return res.status(200).send(hashes);
  } catch (error) {
    console.error("allNfts", error);
    return res.status(500).send("An error occurred.");
  }
}

async function getNftByTokenId(req, res) {
  try {
    const tokenId = req.params.tokenId;

    const foundNft = await Nfts.findOne({
      where: { tokenId: tokenId },
      include: { all: true, nested: true },
    });

    const foundNftAuctions = await Auctions.findOne({
      where: { nftId: tokenId },
      include: { all: true, nested: true },
    });

    foundNft.auctions = foundNftAuctions;

    return res.status(200).send(foundNft);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getNftsByOwner(req, res) {
  try {
    const ownerKey = req.params.ownerKey;

    const foundNfts = await Nfts.findAll({
      where: { ownerKey: ownerKey },
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundNfts);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getAllNftsInAuction(req, res) {
  try {
    const foundNfts = await Nfts.findAll({
      where: { inAuction: true },
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundNfts);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getNftsOfMediaType(req, res) {
  try {
    const mediaType = req.params.type;
    const foundNfts = await Nfts.findAll({
      where: { mediaType: mediaType.toLowerCase() },
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundNfts);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getNftsOfAssetType(req, res) {
  try {
    const assetType = req.params.type;
    const foundNfts = await Nfts.findAll({
      where: { assetType: assetType.toLowerCase() },
      include: { all: true, nested: true },
    });

    return res.status(200).send(foundNfts);
  } catch (error) {
    console.error(error);

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
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function removeNFT(req, res) {
  try {
    const tokenId = req.params.tokenId;

    await Nfts.destroy({ where: { tokenId: tokenId } });
    return res.status(200).send("NFT removed successfully.");
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

// Blockchain deploys

async function grantMinter(req, res) {
  try {
    const publicKey = req.body.publicKey;

    const foundUser = await Users.findOne({
      where: { publicKey: publicKey },
    });

    if (foundUser != null && foundUser.canMint) {
      return res.status(200).send("User can mint");
    }
    // const PATH_TO_SOURCE_KEYS = path.join(__dirname, "..", "chriskey");
    const PATH_TO_SOURCE_KEYS = path.join(__dirname, "..", "nakulkey");
    const keyPairofContract = getKeyPairOfContract(PATH_TO_SOURCE_KEYS);

    const hash = CLPublicKey.fromHex(publicKey).toAccountHash();
    const accounthash = new CLAccountHash(hash);
    const minter = new CLKey(accounthash);

    // NFT contract hash
    // Chris contract = "hash-4c144334e693d5a295be047ebd6519cd2075f223f6d7f5bae0397c90cf1bc115"
    // Nakul contract = "hash-997eb3acf0ff2ddd79e5552f11da1bdd66d7d8a85da0291b28739c1107b43217"
    const contractHash =
      "hash-997eb3acf0ff2ddd79e5552f11da1bdd66d7d8a85da0291b28739c1107b43217";
    const contractHashAsByteArray = [
      ...Buffer.from(contractHash.slice(5), "hex"),
    ];

    let deploy = DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(
        keyPairofContract.publicKey,
        "casper-test",
        1,
        1800000
      ),
      DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashAsByteArray,
        "grant_minter",
        RuntimeArgs.fromMap({
          minter: minter,
        })
      ),
      DeployUtil.standardPayment(10000000000)
    );

    deploy = client.signDeploy(deploy, keyPairofContract);

    let deployHash = await client.putDeploy(deploy);
    const result = await confirmDeploy(deployHash);
    const newUser = {
      publicKey: publicKey,
      canMint: true,
      category: "Collector",
    };
    await Users.create(newUser);

    return res.status(200).send(deployHash);
  } catch (error) {
    console.error(error);

    return res.status(500).send("Error deploying on-chain");
  }
}
async function deploySigned(req, res) {
  try {
    const signedDeployJSON = req.body.signedDeployJSON;

    const deploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    const deployHash = await client.putDeploy(deploy);
    const result = await confirmDeploy(deployHash);
    return res.status(200).send(deployHash);
  } catch (error) {
    console.error(error);

    return res.status(500).send("Error deploying on-chain");
  }
}

async function confirmDeployment(req, res) {
  try {
    const deployHash = req.params.deployHash;

    const result = await confirmDeployStatus(deployHash);
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("Error confirming deploy " + JSON.stringify(error));
  }
}

module.exports = {
  generateMediaUrls,
  addNft,
  getAllNfts,
  confirmDeployment,
  getAllNftsInAuction,
  getNftsOfMediaType,
  getNftsOfAssetType,
  getNftByTokenId,
  getNftsByOwner,
  updateOwner,
  removeNFT,
  grantMinter,
  deploySigned,
};
