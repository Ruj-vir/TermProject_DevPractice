const mongoose = require('mongoose');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email'
      ]
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    tel:{
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      maxLength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);
// Encrypt password using bcrpyt
UserSchema.pre('save', async function(next) {
  const salt = await bcrpyt.genSalt(10);
  this.password = await bcrpyt.hash(this.password, salt);
});
// Sign JWT and Return 
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrpyt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
