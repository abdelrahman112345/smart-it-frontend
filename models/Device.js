const mongoose = require("mongoose");
const deviceSchema = new mongoose.Schema({
    deviceName: String,
    ipAddress: String,
    status: {
        type: String,
        default: "offline",
    },
    lastChecked: Date,
});
const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;