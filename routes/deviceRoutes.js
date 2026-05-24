const express = require("express");
const router = express.Router();

const {
  getDevices,
  addDevice,
  deleteDevice,
  updateDevice
} = require("../controllers/deviceController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("admin", "it"), getDevices);

router.post("/", protect, authorizeRoles("admin", "it"), addDevice);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "it"),
  updateDevice
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteDevice);

module.exports = router;