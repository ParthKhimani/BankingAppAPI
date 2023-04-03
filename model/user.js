const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  confirmPassword: {
    type: String,
    // required: true
  },
  contactNumber: {
    type: Number,
    // required: true
  },
  emailId: {
    type: String,
    // required: true
  },
  accountType: {
    type: String,
    // required: true
  },
  imagePath1: {
    type: String,
    // required: true
  },
  imagePath2: {
    type: String,
    // required: true
  },
  title: {
    type: String,
    // required: true
  },
  firstName: {
    type: String,
    // required: true
  },
  lastName: {
    type: String,
    // required: true
  },
  gender: {
    type: String,
    // required: true
  },
  dateOfBirth: {
    type: Date,
    // required: true
  },
  address1: {
    type: String,
    // required: true
  },
  address2: {
    type: String,
    // required: true
  },
  country: {
    type: String,
    // required: true
  },
  state: {
    type: String,
    // required: true
  },
  city: {
    type: String,
    // required: true
  },
  pin: {
    type: String,
    // required: true
  },
  wpAlert: {
    type: Boolean,
    // required: true
  },
  emailAlert: {
    type: Boolean,
    // required: true
  }
});

module.exports = mongoose.model('User', userSchema);