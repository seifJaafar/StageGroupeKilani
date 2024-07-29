import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme CSS
import 'primereact/resources/primereact.min.css';         // Core CSS
import 'primeicons/primeicons.css';                      // PrimeIcons CSS
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import './index.css';
import "bootstrap/dist/css/bootstrap.css";
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
