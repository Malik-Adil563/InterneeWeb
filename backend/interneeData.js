const express = require('express');
const xl = require('excel4node');
const path = require('path');
const fs = require('fs');
const os = require('os');
const UserOut = require('./checkoutdb');
const UserIn = require('./mongo');

const app = express();
const port = 7001;

app.get('/getUsers', async (req, res) => {
  try {
    console.log('Received request to /getUsers');

    const usersOut = await UserOut.find(); // Fetch all check-out records
    const usersIn = await UserIn.find(); // Fetch all check-in records

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

    // Use a temporary file path
    const tempFilePath = path.join(os.tmpdir(), 'InterneeData.xlsx');

    // Save file to the temporary directory
    wb.write(tempFilePath, (err) => {
      if (err) {
        console.error('Error saving file to temp directory:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('File saved to temp directory:', tempFilePath);

      // Send file to client
      res.setHeader('Content-Disposition', 'attachment; filename=InterneeData.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const readStream = fs.createReadStream(tempFilePath);
      readStream.pipe(res);

      // Optionally delete the file after sending
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
  console.log(`Check-Out Server running on http://localhost:${port}`);
});