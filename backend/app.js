
import express from "express";
import cors from "cors";
import 'dotenv/config';
import helmet from 'helmet';
import mongoose from "./config/db.js";
import contentRoute from './Routes/contentRoute.js';


// Initialize the Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.use(helmet());

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



/*
🌐 Network Detection Strategy
We simulate "same network" sharing by:

Detecting public IP or local IP (via backend)

Using it to group sessions, e.g., all users on 192.168.1.* can see the same content

🧩 Core Features
✅ Share text or files
✅ Access from any device on same network
✅ Auto-delete content after X minutes




// server/models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  ipGroup: String,
  contentType: String,
  data: String, // or Buffer if storing files
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // auto-delete after 10 minutes
  }
});

module.exports = mongoose.model('Content', contentSchema);



// server/routes/content.js
const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const requestIp = require('request-ip');

// Upload content
router.post('/upload', async (req, res) => {
  const ip = requestIp.getClientIp(req) || 'unknown';
  const ipGroup = ip.split('.').slice(0, 3).join('.'); // e.g., "192.168.1"

  const content = new Content({
    ipGroup,
    contentType: req.body.type,
    data: req.body.data,
  });

  await content.save();
  res.send({ status: 'ok' });
});

// Get content for same IP group
router.get('/shared', async (req, res) => {
  const ip = requestIp.getClientIp(req) || 'unknown';
  const ipGroup = ip.split('.').slice(0, 3).join('.');

  const contents = await Content.find({ ipGroup }).sort({ createdAt: -1 });
  res.json(contents);
});

module.exports = router;
🔹 React Frontend (Very Basic)

// client/src/App.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');
  const [shared, setShared] = useState([]);

  const sendData = async () => {
    await axios.post('/api/content/upload', {
      type: 'text',
      data
    });
    setData('');
    fetchData();
  };

  const fetchData = async () => {
    const res = await axios.get('/api/content/shared');
    setShared(res.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <textarea value={data} onChange={e => setData(e.target.value)} />
      <button onClick={sendData}>Share</button>
      <ul>
        {shared.map((item, i) => <li key={i}>{item.data}</li>)}
      </ul>
    </div>
  );
}

export default App;
🧪 Want to Try It Out?
Let me know and I can:

Generate the full codebase

Set it up for localhost or local network

Help deploy it if needed (e.g., with ngrok, Docker, etc.)

Would you like the full working project zipped up, or should we build it step-by-step together?


*/