module.exports = (sequelize, DataTypes) => {
  const Nft = sequelize.define("nft", {
    tokenId: {
      type: DataTypes.STRING,
      unique: true,
    },
    deployerKey: {
      type: DataTypes.STRING,
    },
    ownerKey: {
      type: DataTypes.STRING,
    },
    mediaType: {
      type: DataTypes.STRING,
    },
    artworkUrl: {
      type: DataTypes.STRING,
    },
    musicThumbnailUrl: {
      type: DataTypes.STRING,
    },
    musicFileUrl: {
      type: DataTypes.STRING,
    },
    movieThumbnailUrl: {
      type: DataTypes.STRING,
    },
    movieFileUrl: {
      type: DataTypes.STRING,
    },
    mediaName: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    socialMediaLink: {
      type: DataTypes.STRING,
    },
    tokenHash: {
      type: DataTypes.STRING,
    },
    inAuction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assetSymbol: {
      type: DataTypes.STRING,
    },
    assetType: {
      type: DataTypes.STRING,
    },
    artistName: {
      type: DataTypes.STRING,
    },
    medium: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.DATE,
    },
    size: {
      type: DataTypes.STRING,
    },
  });

  return Nft;
};
