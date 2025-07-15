const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true,'Please add a first name'],
        trim: true,
    },
    lastName:{
        type: String,
        required: [true,'Please add a last name'],
        trim: true,
    },
    username:{
        type: String,
        required: [true,'Username is required'],
        unique: true,
        trim: true,
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
        default: 'https://via.placeholder.com/150x150.png?text=Avatar'
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
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    profileViews: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters']
    },
    company: {
        type: String,
        trim: true,
        maxLength: [100, 'Company cannot exceed 100 characters']
    },
    website: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    twitter: {
        type: String,
        trim: true
    }
},{timestamps: true});

module.exports = mongoose.model("User",userSchema);