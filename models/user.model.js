module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bids: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue("bids").split(";");
      },
      set(val) {
        this.setDataValue("bids", val.join(";"));
      },
    },
  });

  return User;
};
