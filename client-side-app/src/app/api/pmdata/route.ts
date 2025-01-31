// pages/api/proxy-pm.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Get query parameters
  const { lat, lon, tokenPm } = req.query;

  // The API URL to fetch data from the third-party API
  const pmAPI = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${tokenPm}`;

  try {
    // Fetch data from the third-party API
    const response = await fetch(pmAPI);
    const data = await response.json();

    // Send the response data back to the frontend
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}
