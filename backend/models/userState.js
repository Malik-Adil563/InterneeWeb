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

// Define the schema for the 'states' collection
const userStateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,  // Consider using Date type if you plan to perform date operations
    required: true,
    trim: true,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create the model for the 'states' collection
const UserState = mongoose.model("UserState", userStateSchema, 'states'); // 'states' is the collection name

module.exports = UserState;
