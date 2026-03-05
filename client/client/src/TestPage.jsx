import React from 'react';

const TestPage = () => {
  console.log('✅ TestPage rendered');
  
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '20px' }}>
        Test Page - This should work
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        If you can see this, basic React rendering is working.
      </p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f97316',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </div>
  );
};

export default TestPage;