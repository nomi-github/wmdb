const express = require("express");
const homeHelper = require("./homeHelper");
const options = {
  caseSensitive: true,
  strict: true,
};
const router = express.Router(options);

router.get("/", async function (req, res, next) {
  // res.render("pages/loader");
  const response = {};
  // console.log("fjdjfhj");
  // response.popular = await homeHelper.popular(1);
  // response.nowPlaying = await homeHelper.nowPlaying(1);
  // response.genres = await homeHelper.genres();
  // response.recommend = await homeHelper.recommend(1);
  // await console.log(response);
  await res.render("pages/index", { response: response });
});

module.exports = router;
