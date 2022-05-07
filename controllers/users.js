const User = require("../models/users");
const jwt = require("jsonwebtoken");


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.send({success: true, user})
    } catch (error) {
        console.log(error)
        res.send({success: false, error})
    }
}

exports.update = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body)
        res.send({success: true, message: 'User Updated', user: updateUser})
    } catch (error) {
        console.log(error)
        res.send({success: false, error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const users = await User.find({})
        console.log(users)
        res.send({success: true, users})
    } catch (error) {
        res.send({success: false, error})
    }
}

exports.register = async (req, res) => {
    // check email
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({ success: false, error: "Email already taken." });
    }
    req.body.username = req.body.email.split("@")[0]
    const userNameExists = await User.findOne({username: req.body.username});
    if(userNameExists) {
        return res.send({success: false, error: 'Username already exists'})
    }
    try {
      // insert
      const user = new User(req.body);
      const newUser = await user.save();
      
      res.json({ success: true, user: newUser });
    } catch (error) {
      console.log(error);
      res.send({ success: false, error });
    }
};

exports.auth = async (req, res) => {
    try {
        const user = await User.findOne({ $or: [{email: req.body.email}, {username: req.body.email}] })
        
        if(!user) {
            return res.send({success: false, message: 'Cannot find a user with that account'})
        }

        const match = await user.comparePassword(req.body.password)
        if (!match) {
            return res.send({success: false, message: "Invalid Login Credentials"})            }

        const access_token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: 86400
        })

        res.send({success: true, access_token, user})
    } catch (error) {
        console.log(error)
        res.send({success: false, error})
    }
}