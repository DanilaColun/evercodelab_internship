const express = require("express");

function createStatusRoutes() {
  const router = express.Router();

  router.get("/status", (req, res) => {
    res.status(200).send("ok");
  });

  return router;
}

module.exports = createStatusRoutes;
