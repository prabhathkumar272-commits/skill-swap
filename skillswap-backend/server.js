const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/match', require('./routes/match'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/sessions', require('./routes/sessions'));

app.get('/', (req, res) => res.json({ message: '🎓 SkillSwap Campus API Running' }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
