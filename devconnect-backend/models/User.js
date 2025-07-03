const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'Please add a username'],
        unique: true,
    },
    email:{
        type: String,
        required: [true,'Please add an email'],
        unique: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
        ],
    },
    password:{
        type: String,
        required: [true,'Please add a password'],
        minLength: 6,
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user',
    },
    bio: {
        type: String,
        maxLength: [500, 'Bio cannot exceed 500 characters'],
        trim: true
    },
    avatar: {
        type: String,
        default: 'https://www.google.com/imgres?q=avatar%20image%20png&imgurl=https%3A%2F%2Ftoppng.com%2Fuploads%2Fpreview%2Favatar-png-115540218987bthtxfhls.png&imgrefurl=https%3A%2F%2Ftoppng.com%2Ffree-image%2Favatar-png-PNG-free-PNG-Images_140622&docid=I4z_OfsfGAw-pM&tbnid=Gruu3znkNFO40M&vet=12ahUKEwjyjbfLmKGOAxU2b2wGHa6aOn8QM3oECG4QAA..i&w=840&h=859&hcb=2&ved=2ahUKEwjyjbfLmKGOAxU2b2wGHa6aOn8QM3oECG4QAA'
    },
    skills: [{
        type: String,
        trim: true
    }],
    location: {
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    }
},{timestamps: true});

module.exports = mongoose.model("User",userSchema);