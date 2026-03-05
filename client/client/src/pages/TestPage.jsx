import React from 'react';

const TestPage = () => {
  console.log('✅ TestPage rendered at:', new Date().toISOString());
  
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: 'white',
      minHeight: '100vh',
      color: '#333',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', color: '#f97316', marginBottom: '20px' }}>
        ✅ Test Page - Working!
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        If you can see this, basic React rendering is working properly.
      </p>
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Click Me
        </button>
        <button 
          onClick={() => console.log('Console log test')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4a5568',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Test Console
        </button>
      </div>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f7fafc',
        borderRadius: '5px',
        textAlign: 'left'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Debug Info:</h3>
        <p>🕒 Time: {new Date().toLocaleTimeString()}</p>
        <p>🌐 URL: {window.location.href}</p>
        <p>📱 User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  );
};

export default TestPage;