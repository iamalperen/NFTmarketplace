const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
    },
    image: {
    type: String,
    unique: true,
  },
  solanaWallet: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
