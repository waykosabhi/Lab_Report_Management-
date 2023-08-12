const {
  pathologyOrders,
  pathologyAcceptOrder,
  pathologyUploadReports,
} = require("../controllers/pathologyController");
const {
  registerPathology,
  destroyPathology,
  updatePathology,
  deletePathology,
  loginPathology,
  addPathology,
  pathologyGetAll,
} = require("../controllers/pathologyController");
const { isPathology } = require("../middleware/authProtected");

const router = require("express").Router();

router
  .post("/register", registerPathology)
  .post("/login", loginPathology)

  .get("/", pathologyGetAll)
  .post("/add", addPathology)
  .put("/update/:pathologyId", updatePathology)
  .delete("/delete/:pathologyId", deletePathology)
  .delete("/destroy", destroyPathology)

  .get("/orders", isPathology, pathologyOrders)
  .put("/orders/:orderId", isPathology, pathologyAcceptOrder)
  .put("/orders/reports/:orderId", isPathology, pathologyUploadReports);
module.exports = router;
