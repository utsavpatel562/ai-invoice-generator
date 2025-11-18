// authController.js
const jwt = require("jsonwebtoken");
const User = require("../modules/User");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// -------------------- REGISTER --------------------
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// -------------------- LOGIN --------------------
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            });
        } else {
            res.status(401).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// -------------------- GET LOGGED IN USER --------------------
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);  // FIXED

        res.json({
            _id: user._id,   // FIXED
            name: user.name,
            email: user.email,
            businessName: user.businessName || "",
            address: user.address || "",
            phone: user.phone || "",
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// -------------------- UPDATE PROFILE --------------------
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, businessName, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        businessName,
        address,
        phone,
      },
      { new: true }  // return updated user
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};

