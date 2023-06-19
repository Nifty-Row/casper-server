module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define("bid", {
    bidder: {
      type: DataTypes.STRING,
    },
    bid: {
      type: DataTypes.FLOAT,
    },
  });

  return Bid;
};
