const User = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(409).json({
                success: false,
                message: "All fields are required",
            })
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            })
        }

        const newUser = new User({
            name, email: email.toLowerCase(), password, role: "user",
        })

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or passsword"
            })
        }
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
        return res.status(400).json({
            success:false,
            message: "Invalid email or passsword"
        })
       }
        if(!user.active){
            return res.status(403).json({
                success:false,
                message:"Your Account is inactive.contact admin"
            })
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        )
        res.status(200).json({
            success: true,
            message: "Login successfull",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

exports.updateStatus = async (req, res) => {
  try {
    const { active } = req.body; 
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getprofile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"

        })
        console.log(error.message)
    }
}