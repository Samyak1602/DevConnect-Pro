const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req,res,next) => {
    try{
        const {username,email,password} = req.body;

        // Input validation
        if(!username || !email || !password) {
            return res.status(400).json({message: 'Please provide username, email, and password'});
        }

        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const existing = await User.findOne({email});

        if(existing){
            return res.status(400).json({message:'Email already in use'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token for immediate login after registration
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch(err){
        next(err);
    }
}

exports.login = async(req,res,next) => {
    try{
        const {email,password} = req.body;

        // Input validation
        if(!email || !password) {
            return res.status(400).json({message: 'Please provide email and password'});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message:'User does not exist'});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) {
            return res.status(400).json({message:'Incorrect password'});
        }

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch(err){
        next(err);
    }
}