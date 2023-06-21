function findHighestBidder(bids) {
  return bids.reduce(
    (result, bid) => {
      return bid.bid > result.bid
        ? { bidder: bid.bidder, bid: bid.bid }
        : result;
    },
    { bidder: null, bid: 0 }
  );
}

module.exports = findHighestBidder;
