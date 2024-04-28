import React from 'react';
import axios from 'axios';

const Annotation: React.FC = () => {
  const sendRequest = async () => {
    try {
      const response = await axios.post('/annotations/your-new-endpoint-url', {
        // dane, jeśli potrzebne
      });

      console.log(response.data); // Zwrócona odpowiedź z backendu
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div>
      <button onClick={sendRequest}>Send Request</button>
    </div>
  );
};

export default Annotation;
