module.exports = (sequelize, DataTypes) => {
  const Purse = sequelize.define("purse", {
    uref: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    deployHash: {
      type: DataTypes.STRING,
    },
    deployerKey: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
  });

  return Purse;
};
