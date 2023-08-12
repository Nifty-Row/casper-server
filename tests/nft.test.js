const request = require("supertest");
const app = require("../app");
const db = require("../models/index");
const { NFT_PROPS, ERROR_500 } = require("./testData");

describe("NFT test suite", () => {
  const NFT_ENDPOINT = "/api/nft";

  test("Should add NFT", async () => {
    const mockAddNft = jest.fn(() => NFT_PROPS);
    jest.spyOn(db.nfts, "create").mockImplementation(() => mockAddNft());

    const res = await request(app)
      .post(`${NFT_ENDPOINT}/addNft`)
      .send(NFT_PROPS);

    expect(mockAddNft).toHaveBeenCalledTimes(1);
    expect(res.body).toHaveProperty("nft");
  });

  test("Should handle add NFT exception", async () => {
    const mockAddNft = jest.fn(() => {
      throw "Error";
    });
    jest.spyOn(db.nfts, "create").mockImplementation(() => mockAddNft());

    const res = await request(app)
      .post(`${NFT_ENDPOINT}/addNft`)
      .send(NFT_PROPS);

    expect(res.status).toEqual(500);
    expect(res.text).toEqual(ERROR_500);
  });

  test("Should fetch all NFTs", async () => {
    const res = await request(app).get(`${NFT_ENDPOINT}/allNfts`);

    expect(res.status).toEqual(200);
  });
});
