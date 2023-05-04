module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    canMint: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
