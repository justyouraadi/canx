const express = require("express");
const { ServerConfig } = require("./src/config");
const connectToDB = require("./src/config/db.config");
const apiRoutes = require("./src/routes");
const cors = require("cors");
const path = require("path");
const { AttendanceService } = require("./src/service");
const attendanceService = new AttendanceService();
const cron = require("node-cron");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", apiRoutes);

app.listen(ServerConfig.Base.PORT, async () => {
  await connectToDB();
  console.log(`Server is booming on port ${ServerConfig.Base.PORT} 🚀`);
  cron.schedule(
    "0 22 * * *",
    async () => {
      console.log("--- Starting Scheduled Auto-Checkout at 19:30 ---");
      await attendanceService.autoCheckoutAll();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
  // await attendanceService.autoCheckoutAll()
});
