const ping = require("ping");

const checkDeviceStatus = async (ip) => {
  try {
    const res = await ping.promise.probe(ip);
    return res.alive;
  } catch (err) {
    return false;
  }
};

module.exports = { checkDeviceStatus };