import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import axios from 'axios';
import express from 'express';

config();
const app = express();

// Bodyparser setup
app.use(bodyparser.json({ limit: "150mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "150mb", extended: true, parameterLimit: 50000 }));

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// cookies
app.use(cookieParser());

// Routes
app.get('/', function (req, res) {
  res.send('Welcome to our API');
});

app.get('/chart', async function (req, res, next) {
  const { f, n, i, s } = req.query;

  try {
    const response = await axios.get(`http://api.forexfeed.net/data/${process.env.APP_ID}`, {
      params: { f, n, i, s },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  process.env.NODE_ENV === 'production'
    ? res.status(500).json({ message: 'Internal Server Error' })
    : res.status(500).json({
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
      error: err
    });
  console.error(err);
});

// Server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
