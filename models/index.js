const { Sequelize, DataTypes } = require("sequelize");
const database = require("../config/database");

const sequelize = new Sequelize(database.DB, database.USER, database.PASSWORD, {
  host: database.HOST,
  dialect: database.dialect,
  // operatorsAliases: false,
  operatorsAliases: 0,
  pool: {
    max: database.pool.max,
    min: database.pool.min,
    acquire: database.pool.acquire,
    idle: database.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected...");
  })
  .catch((error) => {
    console.log(`DB connection error: ${error}`);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.nfts = require("./nft.model")(sequelize, DataTypes);
db.auctions = require("./auction.model")(sequelize, DataTypes);
db.users = require("./user.model")(sequelize, DataTypes);
db.bids = require("./bid.model")(sequelize, DataTypes);

db.sequelize.sync({ force: true }).then(() => {
  console.log("Resync done!");
});

module.exports = db;
