import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Debug: Log environment variables
console.log('=== Environment Variables ===');
console.log('VITE_GEMINI_API_KEY:', (import.meta.env as any).VITE_GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('All env vars:', import.meta.env);
console.log('=== End Environment ===');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);