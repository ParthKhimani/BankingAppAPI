const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  confirmPassword: String,
  contactNumber: Number,
  emailId: String,
  accountType: String,
  imagePath1: String,
  imagePath2: String,
  title: String,
  firstName: String,
  lastName: String,
  gender: String,
  dateOfBirth: Date,
  address1: String,
  address2: String,
  country: String,
  state: String,
  city: String,
  pin: String,
  wpAlert: Boolean,
  emailAlert: Boolean,
  accounts: {
    account1: {
      balance: Number
    },
    account2: {
      balance: Number
    },
    account3: {
      balance: Number
    },
    account4: {
      balance: Number
    },
    account5: {
      balance: Number
    },
  },
  remarks: String,
});

module.exports = mongoose.model('User', userSchema);