const express = require("express");
const cors = require("cors");
const User = require("./checkoutdb");

const app = express();
const port = 7000;

app.use(express.json());
app.use(cors());

app.get("/getUsers", (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post("/", async (req, res) => {
    const { date, time, email } = req.body;
    console.log('Received data:', { date, time, email }); // Log received data
    try {
        const user = new User({ date, time, email });
        const savedUser = await user.save();
        console.log('Saved Successfully:', savedUser); // Log saved user
        res.status(201).send("Checked");
    } catch (error) {
        console.error('Error saving data:', error); // Log error if save fails
        res.status(500).send("Error adding data: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});