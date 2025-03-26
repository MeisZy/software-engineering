import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';

const App = () => {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000); 
  };

  return (
    <div>
      <button onClick={simulateLoading}>Load Data</button>
      {loading && <LoadingScreen />}
    </div>
  );
};

export default App;