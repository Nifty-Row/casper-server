module.exports = (sequelize, DataTypes) => {
  const Auction = sequelize.define("auction", {
    auctionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nftId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    deployerKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractHash: {
      type: DataTypes.STRING,
    },
    packageHash: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sellNowPrice: {
      type: DataTypes.FLOAT,
    },
    minimumPrice: {
      type: DataTypes.FLOAT,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Auction;
};
