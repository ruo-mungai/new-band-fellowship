import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'

// Add this before ReactDOM.createRoot
window.addEventListener('error', (event) => {
  console.error('🔥 Caught error:', event.error);
  
  // Create visible error display
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '10px';
  errorDiv.style.left = '10px';
  errorDiv.style.right = '10px';
  errorDiv.style.backgroundColor = '#ff4444';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '20px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.zIndex = '99999';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.style.whiteSpace = 'pre-wrap';
  errorDiv.style.maxHeight = '200px';
  errorDiv.style.overflow = 'auto';
  errorDiv.innerHTML = `
    <strong style="font-size: 16px; display: block; margin-bottom: 10px;">🔥 JavaScript Error Detected:</strong>
    ${event.error?.toString() || 'Unknown error'}
    <br><br>
    <strong>Stack:</strong>
    <br>
    ${event.error?.stack || 'No stack trace'}
  `;
  document.body.appendChild(errorDiv);
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔥 Unhandled Promise Rejection:', event.reason);
  
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.bottom = '10px';
  errorDiv.style.left = '10px';
  errorDiv.style.right = '10px';
  errorDiv.style.backgroundColor = '#ff8800';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '20px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.zIndex = '99999';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.innerHTML = `
    <strong>⚠️ Unhandled Promise Rejection:</strong>
    <br>
    ${event.reason?.toString() || 'Unknown error'}
  `;
  document.body.appendChild(errorDiv);
});

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

initializeTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)