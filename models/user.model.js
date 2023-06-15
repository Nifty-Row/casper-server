module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    about: {
      type: DataTypes.TEXT,
    },
    canMint: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    facebook: {
      type: DataTypes.STRING,
    },
    twitter: {
      type: DataTypes.STRING,
    },
    linkedin: {
      type: DataTypes.STRING,
    },
    telegram: {
      type: DataTypes.STRING,
    },
    instagram: {
      type: DataTypes.STRING,
    },
    youtube: {
      type: DataTypes.STRING,
    },
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return User;
};
