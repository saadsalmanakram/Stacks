// ExampleComponent.js
use client;

import { useState } from 'react';

const ExampleComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleStartCrew = async () => {
    try {
      const response = await fetch('/api/start-crew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* your payload here */ }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error calling the API:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleStartCrew}>Start Crew</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ExampleComponent;
