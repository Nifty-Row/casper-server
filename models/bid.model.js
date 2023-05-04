module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define("bid", {
    auctionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bidder: {
      type: DataTypes.STRING,
    },
    bid: {
      type: DataTypes.FLOAT,
    },
  });

  return Bid;
};
