const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/interns');
  

const userSchema = new mongoose.Schema({
    date: String,
    time: String,
    email: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;