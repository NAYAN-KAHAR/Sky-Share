
import express from "express";
import cors from "cors";
import 'dotenv/config';
import helmet from 'helmet';
import mongoose from "./config/db.js";
import contentRoute from './Routes/contentRoute.js';


// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin:'*'
}));

app.use(helmet());
app.set('trust proxy', true);

mongoose.connection.on('open', () => {
  console.log('Database Connected');
});

mongoose.connection.on('error', (err) => {
  console.log('Database Connection Failed', err);
})


app.use('/api', contentRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



