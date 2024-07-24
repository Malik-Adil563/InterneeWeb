import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Home from './components/Home';
import Admin from './components/admin';
import './index.css'; // Assuming you have some global CSS
import './home.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);