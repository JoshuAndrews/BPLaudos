import React from 'react';
import ReactDOM from 'react-dom/client';
// Não precisamos mais do BrowserRouter
// import { BrowserRouter } from 'react-router-dom';

import Laudos from './laudos.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Não precisamos mais do BrowserRouter */}
    <Laudos />
  </React.StrictMode>
);