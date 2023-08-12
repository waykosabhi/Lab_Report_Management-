const {
  continueWithGoogle,
  logoutUser,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/continue-with-Google", continueWithGoogle);
router.post("/logout", logoutUser);

module.exports = router;
