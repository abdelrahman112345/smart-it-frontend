const Device = require("../models/Device");
const { checkDeviceStatus } = require("../utils/pingDevice.js");

// ➕ Add Device
const addDevice = async (req, res) => {
  try {
    const { deviceName, ipAddress } = req.body;

    const isOnline = await checkDeviceStatus(ipAddress);

    // 👑 Admin فقط
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Admin only" });
    // }

    const device = await Device.create({
      deviceName,
      ipAddress,
      status: isOnline ? "online" : "offline"
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get Devices
const getDevices = async (req, res) => {
  try {
    // 👤 user ممنوع
    if (req.user.role === "user") {
      return res.status(403).json({ message: "Access denied" });
    }

    const devices = await Device.find();

    const updatedDevices = await Promise.all(
      devices.map(async (d) => {

        const isOnline = await checkDeviceStatus(d.ipAddress);

        d.status = isOnline ? "online" : "offline";

        await d.save();

        return d;

      })
    );

    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Device 
const updateDevice = async (req, res) => {
  try {
    const { deviceName, ipAddress, status } = req.body;

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.deviceName = deviceName || device.deviceName;
    device.ipAddress = ipAddress || device.ipAddress;
    device.status = status || device.status;

    await device.save();

    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete Device
const deleteDevice = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    await device.deleteOne();

    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDevice,
  getDevices,
  deleteDevice,
  updateDevice
};