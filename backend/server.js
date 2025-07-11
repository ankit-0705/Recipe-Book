const connectToMongo = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.web_Port || 5000

// const allowedOrigins = ['https://recipe-book-swart-pi.vercel.app','http://localhost:5173']

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

//Middlewares
app.use((req, res, next) => {
  // Allow requests from your specific origin
  res.setHeader('Access-Control-Allow-Origin', 'https://recipe-book-swart-pi.vercel.app');
  // Or allow from any origin (less secure)
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors({origin:'*',credential:true}));
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