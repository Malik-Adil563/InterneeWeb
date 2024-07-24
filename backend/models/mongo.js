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

// Define the schema for the 'checkin' collection
const userInSchema = new mongoose.Schema({
  date: String,
  time: String,
  email: String,
});

// Create the model for the 'checkin' collection
const UserIn = mongoose.model("UserIn", userInSchema, 'checkin'); // 'checkin' is the collection name

module.exports = UserIn;