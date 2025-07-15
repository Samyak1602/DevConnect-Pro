const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper function to generate unique username
const generateUniqueUsername = async (firstName) => {
    const baseUsername = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;
    
    // Keep trying until we find a unique username
    while (await User.findOne({ username })) {
        // Generate random 3-4 digit number
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        username = `${baseUsername}${randomNum}`;
        counter++;
        
        // Fallback: if we've tried too many times, add timestamp
        if (counter > 10) {
            username = `${baseUsername}${Date.now().toString().slice(-6)}`;
            break;
        }
    }
    
    return username;
};

exports.register = async (req,res,next) => {
    try{
        const {firstName, lastName, email, password} = req.body;

        // Input validation
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({message: 'Please provide first name, last name, email, and password'});
        }

        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        // Check for existing email
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:'This email address is already registered. Please use a different email or try logging in.'});
        }

        // Generate unique username
        const username = await generateUniqueUsername(firstName);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
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
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch(err){
        // Handle MongoDB duplicate key errors as fallback
        if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({message: 'This email address is already registered. Please use a different email or try logging in.'});
            }
            if (err.keyPattern && err.keyPattern.username) {
                return res.status(400).json({message: 'This username is already taken. Please choose a different username.'});
            }
            return res.status(400).json({message: 'An account with this information already exists.'});
        }
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
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch(err){
        next(err);
    }
}