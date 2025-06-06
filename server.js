const express = require('express');
const mongoose = require('mongoose');
const chapterRoutes = require('./routes/chapterRoutes');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/api/v1/chapters', chapterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
