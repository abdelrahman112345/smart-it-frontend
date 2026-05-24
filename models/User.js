const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String, 
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["admin", "it", "user"],
        default: "admin",
    },

});
const User = mongoose.model("User", userSchema);
module.exports = User;