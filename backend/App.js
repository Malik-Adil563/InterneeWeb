const express = require('express');
const cors = require('cors');
const xl = require('excel4node');
const path = require('path');
const fs = require('fs');
const os = require('os');
const mongoose = require('mongoose');

// Load your Mongoose models
const UserIn = require('./models/mongo'); // Adjust the path as needed
const UserOut = require('./models/checkoutdb'); // Adjust the path as needed
const User = require('./models/userMongo'); // Adjust the path as needed
const currState = require('./models/userState'); // This should be for user state

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://octaloop-interns.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.json("Hello");
});

// Check-In route
app.post('/checkin', async (req, res) => {
  const { date, time, email } = req.body;
  console.log('Received data:', { date, time, email });

  try {
    const user = new UserIn({ date, time, email });
    const savedUser = await user.save();
    console.log('Saved Successfully:', savedUser);
    res.status(201).send("Checked In");
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send("Error adding data: " + error.message);
  }
});

// Check-Out route
app.post('/checkout', async (req, res) => {
  const { date, time, email } = req.body;
  console.log('Received data:', { date, time, email });

  try {
    const user = new UserOut({ date, time, email });
    const savedUser = await user.save();
    console.log('Saved Successfully:', savedUser);
    res.status(201).send("Checked Out");
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send("Error adding data: " + error.message);
  }
});

// Posting current state
app.post('/state', async (req, res) => {
  const { email, state } = req.body;
  console.log('Received data:', { email, state });

  try {
    // Find existing state entry by email and update or create a new one
    const existingState = await currState.findOne({ email });
    if (existingState) {
      existingState.state = state;
      await existingState.save();
    } else {
      const userState = new currState({ email, state });
      await userState.save();
    }

    console.log('State Saved Successfully');
    res.status(201).send("State Saved!");
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send("Error adding data: " + error.message);
  }
});

// Getting state
app.get('/getState', async (req, res) => {
  const { email } = req.query;
  console.log('Received request to /getState with email:', email);

  try {
    const state = await currState.findOne({ email });
    if (state) {
      console.log('email with state found');
      res.json(state);
    } else {
      res.status(404).send('State not found');
    }
  } catch (error) {
    console.error('Error fetching State:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to delete state records for yesterday
app.delete('/deleteYesterdayState', async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Delete all records for yesterday
    await currState.deleteMany({ date: formattedDate });

    console.log('Deleted yesterday\'s state data');
    res.status(200).send('Deleted yesterday\'s state data');
  } catch (error) {
    console.error('Error deleting yesterday\'s state data:', error);
    res.status(500).send('Error deleting yesterday\'s state data');
  }
});

// Route to fetch users from check-in and check-out collections
app.get('/getUsers', async (req, res) => {
  try {
    console.log('Received request to /getUsers');
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to generate and download Excel file
app.get('/generateExcel', async (req, res) => {
  try {
    console.log('Received request to /generateExcel');

    const usersOut = await UserOut.find();
    const usersIn = await UserIn.find();

    if ((!usersOut || usersOut.length === 0) && (!usersIn || usersIn.length === 0)) {
      console.log('No users found');
      return res.status(404).send('No check-out and check-in records found');
    }

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Internees Check-In and Check-Out');

    // Check-in heading
    const checkInHeadings = ["Check-In Data"];
    checkInHeadings.forEach((heading, index) => {
      ws.cell(1, index + 1).string(heading);
    });

    // Heading for Check-In data
    const checkInHeading = ["Email", "Time", "Date"];
    checkInHeading.forEach((heading, index) => {
      ws.cell(2, index + 1).string(heading);
    });

    usersIn.forEach((user, rowIndex) => {
      ws.cell(rowIndex + 3, 1).string(user.email || 'N/A');
      ws.cell(rowIndex + 3, 2).string(user.time || 'N/A');
      ws.cell(rowIndex + 3, 3).string(user.date || 'N/A');
    });

    // Leave a blank column between check-in and check-out data
    const checkOutStartColumn = 8;

    // Check-Out heading
    const checkOutHeadings = ["Check-Out Data"];
    checkOutHeadings.forEach((heading, index) => {
      ws.cell(1, checkOutStartColumn + index).string(heading);
    });

    // Heading for Check-Out data
    const checkOutHeading = ["Email", "Time", "Date"];
    checkOutHeading.forEach((heading, index) => {
      ws.cell(2, checkOutStartColumn + index).string(heading);
    });

    usersOut.forEach((user, rowIndex) => {
      ws.cell(rowIndex + 3, checkOutStartColumn).string(user.email || 'N/A');
      ws.cell(rowIndex + 3, checkOutStartColumn + 1).string(user.time || 'N/A');
      ws.cell(rowIndex + 3, checkOutStartColumn + 2).string(user.date || 'N/A');
    });

    const tempFilePath = path.join(os.tmpdir(), 'InterneeData.xlsx');

    wb.write(tempFilePath, (err) => {
      if (err) {
        console.error('Error saving file to temp directory:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('File saved to temp directory:', tempFilePath);

      res.setHeader('Content-Disposition', 'attachment; filename=InterneeData.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const readStream = fs.createReadStream(tempFilePath);
      readStream.pipe(res);

      readStream.on('end', () => {
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('Error deleting file from temp directory:', err);
          } else {
            console.log('File deleted from temp directory');
          }
        });
      });

      readStream.on('error', (err) => {
        console.error('Error reading file:', err);
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('Error deleting file from temp directory:', err);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error generating Check-Out file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
