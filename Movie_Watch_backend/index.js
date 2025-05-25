const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const WatchList = require('./watch_list');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

// Add Movie
app.post('/api/movies', async (req, res) => {
  const { title, genre, year, watched, Watched } = req.body;
  console.log('POST request body:', req.body); // Debug
  if (!title || !genre || !year) {
    return res.status(400).json({ error: 'Title, genre, and year are required' });
  }
  try {
    const movie = await WatchList.create({
      title,
      genre,
      year,
      Watched: Watched !== undefined ? Watched : watched || false,
    });
    console.log('Movie added:', movie);
    res.status(201).json({ message: 'Movie added successfully', data: movie });
  } catch (err) {
    console.error('Error creating movie:', err);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Get All Movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await WatchList.find();
    console.log('Fetched movies:', movies); // Debug
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Update Movie
app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, year, watched, Watched } = req.body;
  console.log('PUT request body:', req.body); // Debug
  try {
    const updateData = {
      title,
      genre,
      year,
      Watched: Watched !== undefined ? Watched : watched,
    };
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);
    const movie = await WatchList.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    console.log('Updated movie:', movie); // Debug
    res.json({ message: 'Movie updated successfully', data: movie });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete Movie
app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await WatchList.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));