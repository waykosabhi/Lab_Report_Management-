const express = require("express");
require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { isDoctor } = require("./middleware/authProtected");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static("uploads"));
app.use(express.static("reports"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/admin", require("./routes/AdminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/pathology", require("./routes/pathologyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dummy", require("./routes/dummyRoutes"));

app.use((err, req, res, next) => {
  return res
    .status(500)
    .json({ message: err.message || "somthing went wrong" });
});

app.use((req, res) => {
  return res.status(404).json({ message: "Resource NOt Found:404" });
});

mongoose.connection.once("open", () => {
  console.log("Database Connected");
  app.listen(PORT, console.log(`http://localhost:${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log("Unable to connect Database" + err);
});
