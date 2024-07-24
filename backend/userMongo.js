const mongoose = require("mongoose");

// Connect to the MongoDB cluster and specify the database 'adilm09'
mongoose.connect('mongodb+srv://adilm09:Camb786@cluster0.kb3vcsh.mongodb.net/adilm09', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Define the schema for the 'checkout' collection
const userSchema = new mongoose.Schema({
  email: String
});

// Create the model for the 'checkout' collection
const User = mongoose.model("User", userSchema, 'emails'); // 'checkout' is the collection name

module.exports = User;