const express = require("express");
const cors = require("cors");
const User = require("./mongo");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/getUsers", (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post("/", async (req, res) => {
    const { date, time, email } = req.body;
    try {
        const user = new User({ date, time, email });
        await user.save();
        res.status(201).send("Checked");
        console.log("Saved Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding data: " + error.message);
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
