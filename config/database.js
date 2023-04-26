module.exports = {
  HOST: "127.0.0.1",
  USER: "casper2",
  PASSWORD: "cAsper@#pas$",
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
