const connectToMongo = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.web_Port

const allowedOrigins = ['https://recipe-book-swart-pi.vercel.app','http://localhost:5173']

//Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.options('*',cors());
app.use(express.json()); 

//Routes
app.use('/api/recipe',require('./routes/recipePage'));
app.use('/api/profile',require('./routes/profilePage'));

//Start server and Handle errors
try {
  app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`)
  })
} catch (error) {
  console.error(`Error occured: ${error.message}.`);
  process.exit(1);
}

//Connect to MongoDB
try {
  connectToMongo(); 
} catch (error) {
  console.error(`Error occured: ${error.message}.`);
  process.exit(1);
}