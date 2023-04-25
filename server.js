const express = require("express");
const cors = require("cors");
const nftRoutes = require("./routes/nft.routes");
const auctionRoutes = require("./routes/auction.routes");
const swaggerDocs = require("./utils/swagger");

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
app.use("/api/nft", nftRoutes);
app.use("/api/auction", auctionRoutes);

app.listen(PORT, () => {
  swaggerDocs(app, PORT);
  console.info(`Server running on port ${PORT}`);
});
