const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  user_email: { type: String, required: true, unique: true },
  user_password: { type: String, required: true },  
  user_mobile: { type: String, required: true, default:"000000000"},
  user_dob: { type: Date, required: true },
});

module.exports = mongoose.model('User', userSchema);;
