const { CasperServiceByJsonRPC } = require('casper-js-sdk');
const GRPC_URL = 'https://rpc.testnet.casperlabs.io/rpc';
const casperService = new CasperServiceByJsonRPC(GRPC_URL);

const db = require("../models");
const Users = db.users;

async function addNewWallet(req, res) {
  const publicKey = req.body.publicKey;
  try {
    const foundUser = await Users.findOne({
      where: { publicKey: publicKey },
    });
    if (foundUser == null) {
      const newUser = {
        publicKey: publicKey,
        canMint: false,
        category: "Collector",
      };
      await Users.create(newUser);
    }
    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
}
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

async function userBalance(req, res) {
  const { publicKey } = req.query;

  try {
    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required.' });
    }

    const status = await casperService.getStatus();
    const stateRootHash = status.last_added_block_info.state_root_hash;

    const uref = await casperService.getAccountBalanceUrefByPublicKey(
      stateRootHash,
      publicKey
    );
    const balance = await casperService.getAccountBalance(stateRootHash, uref);

    return res.status(200).json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return res.status(500).json({ error: 'An error occurred while fetching balance.' });
  }
}


module.exports = {
  addNewWallet,
  getAllUsers,
  getUserByKey,
  getUsersByCategory,
  updateUser,
  userBalance,
};
