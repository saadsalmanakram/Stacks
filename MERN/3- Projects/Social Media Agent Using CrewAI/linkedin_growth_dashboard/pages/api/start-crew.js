// /pages/api/start-crew.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch('http://localhost:5000/start-crew', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body), // Send the request body from the client
        });
        
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching from the external API:', error);
        res.status(500).json({ error: 'Failed to fetch data from the backend' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  