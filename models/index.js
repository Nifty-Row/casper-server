const { Sequelize, DataTypes } = require("sequelize");
const database = require("../config/database");

const sequelize = new Sequelize(database.DB, database.USER, database.PASSWORD, {
  host: database.HOST,
  port: database.PORT,
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

const Nft = require("./nft.model")(sequelize, DataTypes);
const Auction = require("./auction.model")(sequelize, DataTypes);
const User = require("./user.model")(sequelize, DataTypes);
const Bid = require("./bid.model")(sequelize, DataTypes);
const Purse = require("./purse.model")(sequelize, DataTypes);

User.hasMany(Nft);
Nft.belongsTo(User);

Auction.hasOne(Nft);
Nft.belongsTo(Auction);

User.hasMany(Auction);
Auction.belongsTo(User);

User.hasMany(Bid);
Bid.belongsTo(User);

Auction.hasMany(Bid);
Bid.belongsTo(Auction);

User.hasOne(Purse);
Purse.belongsTo(User);

db.nfts = Nft;
db.auctions = Auction;
db.users = User;
db.bids = Bid;
db.purses = Purse;

db.sequelize.sync().then(() => {
  console.log("Resync done!");
});

module.exports = db;
