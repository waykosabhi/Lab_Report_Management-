const {
  getAllAdmin,
  registerAdmin,
  destroyAdmin,
  loginAdmin,
  adminGetAllTests,
  adminAddTest,
  adminUpdateTest,
  adminDeleteTest,
  adminDestroyTest,
  adminAllOrders,
  adminUpdateOrders,
  adminDeleteOrders,
} = require("../controllers/AdminController");
const { destroyOrderController } = require("../controllers/OrderController");

const router = require("express").Router();

router
  .get("/", getAllAdmin)
  .post("/register", registerAdmin)
  .post("/login", loginAdmin)
  .delete("/destroy", destroyAdmin)

  .get("/test", adminGetAllTests)
  .post("/test/add", adminAddTest)
  .put("/test/:testId", adminUpdateTest)
  .delete("/test/:testId", adminDeleteTest)
  .delete("/test/destroy", adminDestroyTest)

  .get("/order", adminAllOrders)
  .put("/order/update/:orderId", adminUpdateOrders)
  .delete("/order/delete/:orderId", adminDeleteOrders)
  .delete("/order/destroy", destroyOrderController);

module.exports = router;
