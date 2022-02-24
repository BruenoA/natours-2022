const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name can not be empty'],
  },
  email: {
    type: String,
    required: [true, 'Email can not be empty'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password can not be empty'],
    select: false,
  },
  passwordChangeAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation can not be empty'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Incorrect password confirmation',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    return parseInt(this.passwordChangeAt.getTime() / 1000, 10) > JWTTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
