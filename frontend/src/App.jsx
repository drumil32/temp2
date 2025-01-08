import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationComponent = () => {
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState('');
  const [error, setError] = useState('');

  // Fetch user's location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setError('Unable to retrieve location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Handle admin location submission
  const handleAdminSubmit = async () => {
    if (!location) {
      setError('Location not available.');
      return;
    }

    try {
      await axios.post('http://location:3000/api/admin/login', { lat: location.lat, lng: location.lng });
      alert('Admin location stored successfully!');
    } catch (err) {
      setError('Failed to store admin location.');
    }
  };

  // Handle customer distance calculation
  const handleCustomerDistance = async () => {
    if (!location) {
      setError('Location not available.');
      return;
    }

    try {
      const response = await axios.post('http://location:3000/api/customer/distance', {
        lat: location.lat,
        lng: location.lng,
      });
      setDistance(response.data.distance);
    } catch (err) {
      setError('Failed to calculate distance.');
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div>
      <h1>Location Tracking</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label htmlFor="role">Select Role: </label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">Customer</option>
        <option value="admin">Admin</option>
      </select>

      {role === 'admin' ? (
        <>
          <h2>Admin Dashboard</h2>
          {!location ? (
            <p>Fetching your location...</p>
          ) : (
            <p>
              Your Location: Latitude: {location.lat}, Longitude: {location.lng}
            </p>
          )}
          <button onClick={handleAdminSubmit}>Submit Admin Location</button>
        </>
      ) : (
        <>
          <h2>Customer Dashboard</h2>
          {!location ? (
            <p>Fetching your location...</p>
          ) : (
            <p>
              Your Location: Latitude: {location.lat}, Longitude: {location.lng}
            </p>
          )}
          <button onClick={handleCustomerDistance}>Calculate Distance</button>
          {distance && <p>Distance to Admin: {distance}</p>}
        </>
      )}
    </div>
  );
};

export default LocationComponent;
