module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  PORT: 3306,
  DB: "yasuke_casper",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
