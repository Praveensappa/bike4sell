const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on ${port}`));
