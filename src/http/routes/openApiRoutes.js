const express = require("express");
const openApiSpec = require("../../docs/openapi");

function createOpenApiRoutes() {
  const router = express.Router();

  router.get("/openapi.json", (req, res) => {
    return res.status(200).json(openApiSpec);
  });

  return router;
}

module.exports = createOpenApiRoutes;
