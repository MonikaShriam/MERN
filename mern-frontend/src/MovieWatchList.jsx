import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieWatchList() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    year: '',
    Watched: false,
  });

  // Base API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch movies
  const fetchMovies = async () => {
    try {
      setMovies([]); // Clear to force UI refresh
      const response = await axios.get(API_URL);
      console.log('Fetched movies:', response.data); // Debug
      setMovies(response.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  };

  // Load movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Update form for editing
  useEffect(() => {
    if (selectedMovie) {
      const watchedStatus = selectedMovie.Watched || selectedMovie.watched || false;
      setFormData({
        title: selectedMovie.title,
        genre: selectedMovie.genre,
        year: selectedMovie.year,
        Watched: watchedStatus,
      });
      console.log('Editing movie:', { ...selectedMovie, Watched: watchedStatus }); // Debug
    } else {
      setFormData({ title: '', genre: '', year: '', Watched: false });
    }
  }, [selectedMovie]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = { ...formData, [name]: type === 'checkbox' ? checked : value };
    console.log('Form updated:', newFormData); // Debug
    setFormData(newFormData);
  };

  // Handle add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        genre: formData.genre,
        year: parseInt(formData.year), // Ensure year is number
        Watched: formData.Watched, // Explicitly include Watched
      };
      console.log('Sending payload:', payload); // Debug
      let response;
      if (selectedMovie) {
        response = await axios.put(`${API_URL}/${selectedMovie._id}`, payload);
      } else {
        response = await axios.post(API_URL, payload);
      }
      console.log('Server response:', response.data); // Debug
      fetchMovies();
      setFormData({ title: '', genre: '', year: '', Watched: false });
      setSelectedMovie(null);
    } catch (err) {
      console.error('Error saving movie:', err.response?.data || err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMovies();
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    const watched = movie.Watched || movie.watched || false;
    if (filter === 'watched') return watched;
    if (filter === 'toWatch') return !watched;
    return true;
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Movie Watchlist
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          {selectedMovie ? 'Edit Movie' : 'Add Movie'}
        </h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          required
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            name="Watched"
            checked={formData.Watched}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          Watched
        </label>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {selectedMovie ? 'Update' : 'Add'} Movie
        </button>
        {selectedMovie && (
          <button
            type="button"
            onClick={() => setSelectedMovie(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: filter === 'all' ? '#007bff' : '#e9ecef',
            color: filter === 'all' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('watched')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: filter === 'watched' ? '#007bff' : '#e9ecef',
            color: filter === 'watched' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Watched
        </button>
        <button
          onClick={() => setFilter('toWatch')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'toWatch' ? '#007bff' : '#e9ecef',
            color: filter === 'toWatch' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          To Watch
        </button>
      </div>

      {/* Movie List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredMovies.map((movie) => (
          <div
            key={movie._id}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{movie.title}</h3>
              <p style={{ margin: '5px 0' }}>Genre: {movie.genre}</p>
              <p style={{ margin: '5px 0' }}>Year: {movie.year}</p>
              <p style={{ margin: '5px 0' }}>
                Status: {movie.Watched || movie.watched ? 'Watched' : 'To Watch'}
              </p>
            </div>
            <div>
              <button
                onClick={() => setSelectedMovie(movie)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(movie._id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieWatchList;
