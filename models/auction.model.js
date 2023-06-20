module.exports = (sequelize, DataTypes) => {
  const Auction = sequelize.define("auction", {
    tokenId: {
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
      unique: true,
    },
    deployHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    packageHash: {
      type: DataTypes.STRING,
      unique: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
