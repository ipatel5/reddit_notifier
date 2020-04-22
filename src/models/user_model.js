const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        firstName: {
            type: String,
            required: true,
            trim: true,
            pii: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            pii: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            pii: true,
        },
        favSubReddits:{
            type: Array,
            required: false
        },
        emailNotification:{
            type: Boolean,
            default: true
        }
    },
);

const User = mongoose.model('Users', userSchema);
module.exports = User;
