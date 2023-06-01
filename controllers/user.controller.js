const db = require("../models");
const Users = db.users;

async function getAllUsers(req, res) {
  try {
    const foundUsers = await Users.findAll({
      include: { all: true, nested: true },
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
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundUsers);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function getUserByKey(req, res) {
  try {
    const publicKey = req.params.publicKey;
    const foundUser = await Users.findOne({
      where: { publicKey: publicKey },
      include: { all: true, nested: true },
    });
    return res.status(200).send(foundUser);
  } catch (error) {
    console.error(error);

    return res.status(500).send("An error occurred.");
  }
}

async function updateUser(req, res) {
  try {
    const publicKey = req.params.publicKey;
    const column = req.body.column;
    const value = req.body.value;

    await Users.update(
      { [column]: value },
      {
        where: { publicKey: publicKey },
      }
    );
    return res.status(200).send("User updated");
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

module.exports = {
  getAllUsers,
  getUserByKey,
  getUsersByCategory,
  updateUser,
};
