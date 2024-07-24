import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Image from "../assets/octatech.png";
import Logo from "../assets/logo.png";

const Login = () => {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const fetchEmails = () => {
    Axios.get("http://localhost:8000/getUsers")
      .then(response => {
        const emailList = response.data.map(item => item.email);
        setEmails(emailList);
      })
      .catch(error => {
        console.error('Error fetching emails:', error);
      });
  };

  const submithandler = (event) => {
    event.preventDefault();

    if (email && emails.includes(email)) {
      navigate('/home', { state: { email } });
    } else {
      alert('Email not found in the list.');
    }
  };

  const adminhandler = (event) => {
    event.preventDefault();

    if (email === "admin@octa.com") {
      navigate('/admin');
    } else {
      alert('Incorrect Email !');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Background" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome to OctaLOOP Tech!</h2>
            <p>Please enter Email</p>
            <input
              type="email"
              name="email"
              className='email'
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="login-center-buttons">
              <form onSubmit={submithandler}>
                <input type="submit" value="Login" id="button" className='bun' />
              </form>
              <form onSubmit={adminhandler}>
                <button type="submit" className='bun'>Login as Administrator</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;