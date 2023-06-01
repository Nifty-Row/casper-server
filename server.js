const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const nftRoutes = require("./routes/nft.routes");
const auctionRoutes = require("./routes/auction.routes");
const userRoutes = require("./routes/user.routes");
const swaggerDocs = require("./utils/swagger");

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// APIs
app.use("/api/nft", nftRoutes);
app.use("/api/auction", auctionRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  swaggerDocs(app, PORT);
  console.info(`Server running on port ${PORT}`);
});
