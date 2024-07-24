const express = require("express");
const cors = require("cors");
const User = require("./userMongo");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/getUsers", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

app.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = new User({ email });
    await user.save();
    res.status(201).send("User added successfully");
    console.log("Saved Successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});