// authController.js
const jwt = require("jsonwebtoken");
const User = require("../modules/User");

// helper: generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc    Register New User
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async(req, res) => {
    const {name, email, password} = req.body;
    try {
        if(!name || !email || !password) {
            return res.status(400).json({message: "Please fill all fields"});
        }
        // check if user exists in DB
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({message: "User already exists"});
        }
        // if user not found, create user
        const user = await User.create({name, email, password});
        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        res.status(500).json({message: "Server error"});
    } 
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}).select("+password");
        if(user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),

                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            })
        } else {
            res.status(401).json({message: "Invalid Credientials"});
        }
    } catch (error) {
        res.status(500).json({message: "Server error"});
    } 
};

// @desc    get current logged-in user
// @route   POST /api/auth/me
// @access  Private
exports.getMe = async(req, res) => {
    try {
    } catch (error) {
        res.status(500).json({message: "Server error"});
    } 
};

// @desc    Update user profile
// @route   POST /api/auth/me
// @access  Private
exports.updateUserProfile = async(req, res) => {
    try {
    } catch (error) {
        res.status(500).json({message: "Server error"});
    } 
};