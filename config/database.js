module.exports = {
  HOST: "localhost",
  USER: "casper2",
  PASSWORD: "cAsper@#pas$",
  DB: "yasuke_casper",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
