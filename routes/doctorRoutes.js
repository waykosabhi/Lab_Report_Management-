const {
  addTestController,
  getAllOrders,
} = require("../controllers/OrderController");
const {
  getAllDoctor,
  registerDoctor,
  destroyDoctor,
  updateDoctor,
  deleteDoctor,
  loginDoctor,
  getAllDoctorTests,
} = require("../controllers/doctorControllers");
const { isDoctor } = require("../middleware/authProtected");

const router = require("express").Router();

router
  .get("/", isDoctor, getAllDoctor)
  .post("/register", registerDoctor)
  .post("/login", loginDoctor)
  .delete("/destroy", destroyDoctor)
  .put("/update/:doctorId", updateDoctor)
  .delete("/delete/:doctorId", deleteDoctor)

  .get("/test", getAllDoctorTests)

  .post("/test/add", addTestController)
  .get("/orders",isDoctor, getAllOrders);
module.exports = router;
