const { addProfile } = require("../controllers/dummyController");

  const router = require("express").Router();
  
  router.post("/", addProfile);

  
  module.exports = router;
  