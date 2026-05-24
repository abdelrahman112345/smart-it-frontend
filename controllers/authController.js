const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const userExits = await User.findOne({email});
        if (userExits) {
            return res.status(400).json({message: "User Already Exits."});
        }
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });
        res.status(201).json({message: "User Created Successfully.", user});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

// Login
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // ❌ حماية من undefined
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1000d" }
        );

        return res.json({
            message: "Login Successful",
            token,
            user
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { register, login };