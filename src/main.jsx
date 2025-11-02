import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-size: 24px;">ERROR: Root element not found!</div>';
  throw new Error('Root element not found');
}

try {
  console.log('Starting React render...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('React app mounted successfully');
} catch (error) {
  console.error('Error mounting React:', error);
  rootElement.innerHTML = `
    <div style="padding: 50px; background: #ff0000; color: white; font-size: 20px;">
      <h1>React Mount Error</h1>
      <pre>${error.toString()}</pre>
      <pre>${error.stack}</pre>
    </div>
  `;
}

