// Network Monitoring
const ping = require("ping");
const Device = require("../models/Device");
const sendEmailAlert = require("./emailService");

// نخزن الحالة السابقة لكل جهاز
const previousStatusMap = new Map();

const checkDevices = async (io) => {
  try {
    const devices = await Device.find();

    for (let device of devices) {
      const res = await ping.promise.probe(device.ipAddress);

      const newStatus = res.alive ? "online" : "offline";

      const previousStatus = previousStatusMap.get(device._id.toString());

      device.status = newStatus;
      device.lastChecked = new Date();

      await device.save();

      // 🔥 لو الجهاز كان شغال وبقى وقع
      if (previousStatus === "online" && newStatus === "offline") {
        await sendEmailAlert(device);
      }

      // تحديث الحالة القديمة
      previousStatusMap.set(device._id.toString(), newStatus);
    }

    io.emit("devicesUpdated", devices);
    console.log("Devices Updated + emitted...");
  } catch (err) {
    console.error(err);
  }
};

module.exports = checkDevices;