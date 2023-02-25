const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const hospitals = require('./routes/hospitals');

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
app.use(express.json());
app.use('/api/v1/hospitals',hospitals);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server running in ", process.env.NODE_ENV, " mode on port ", PORT));

process.on('unhandleRejection', (err, promise) => {
    console.log(`Error: ${(err, message)}`);
    server.close(() => process.exit(1));
  });