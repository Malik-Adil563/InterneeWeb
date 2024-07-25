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
  }
}, {
  timestamps: true // Optional: Adds createdAt and updatedAt fields
});

// Create the model for the 'states' collection
const currState = mongoose.model("currState", userStateSchema, 'states'); // 'states' is the collection name

module.exports = currState;
