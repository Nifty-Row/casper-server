const db = require("../models");
const Users = db.users;

async function getAllUsers(req, res) {
  try {
    const foundUsers = await Users.findAll({
      include: all,
    });
    return res.status(200).send(foundUsers);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getUsersByCategory(req, res) {
  try {
    const category = req.params.category;
    const foundUsers = await Users.findAll({
      where: { category: category.charAt(0).toUpperCase() + category.slice(1) },
      include: all,
    });
    return res.status(200).send(foundUsers);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

module.exports = {
  getAllUsers,
  getUsersByCategory,
};
