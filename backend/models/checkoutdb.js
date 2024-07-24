const mongoose = require("mongoose");

// Connect to the MongoDB cluster and specify the database 'adilm09'
mongoose.connect('mongodb+srv://adilm09:Camb786@cluster0.kb3vcsh.mongodb.net/adilm09?retryWrites=true&w=majority', {
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
const userOutSchema = new mongoose.Schema({
  date: String,
  time: String,
  email: String,
});

// Create the model for the 'checkout' collection
const UserOut = mongoose.model("UserOut", userOutSchema, 'checkout'); // 'checkout' is the collection name

module.exports = UserOut;