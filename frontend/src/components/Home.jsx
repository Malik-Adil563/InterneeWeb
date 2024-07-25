import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [isCheckinVisible, setIsCheckinVisible] = useState(true);
  const [message, setMessage] = useState('Please check-in');
  const [isGoodbyeVisible, setIsGoodbyeVisible] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [state, setState] = useState([]);

  useEffect(() => {
    if (isCheckinVisible) {
      setMessage('Please check-in');
    } else {
      setMessage('Please Check-Out');
    }
  }, [isCheckinVisible]);

  const toggleCheckin = (event) => {
    event.preventDefault();
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = `${year}-${month}-${date}`;
    const currentTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    const data = { date: currentDate, time: currentTime, email };

    const fetchState = () => {
    Axios.get("https://internee-web.vercel.app/getState")
      .then(response => {
        const states = response.data.map(item => item.state);
        setState(states);
      })
      .catch(error => {
        console.error('Error fetching state:', error);
      });
  };

  const submithandler = (event) => {
    event.preventDefault();

    if (states=="checkin") {
      setIsCheckinVisible(false);
    } else {
      setIsCheckinVisible(true);
    }
  };

    if (isCheckinVisible) {
      Axios.post('https://internee-web.vercel.app/checkin', data)
        .then(response => {
          console.log(response.data);
          setMessage('Welcome to OctaLOOP Technologies');
          setShowWelcomeMessage(true);
          setTimeout(() => {
            setShowWelcomeMessage(false);
            setIsCheckinVisible(false);
            setMessage('Please Check-Out');
          }, 2000); // Show welcome message for 2 seconds
        })
        .catch(error => {
          console.error('Error adding data:', error);
        });
      Axios.post('https://internee-web.vercel.app/state', {"checkin"})
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error adding data:', error);
        });
    } else {
      Axios.post('https://internee-web.vercel.app/checkout', data)
        .then(response => {
          console.log(response.data);
          setMessage('Good-Bye');
          setIsGoodbyeVisible(true);
          setTimeout(() => {
            navigate('/');
          }, 2000); // Redirect to login page after 2 seconds
        })
        .catch(error => {
          console.error('Error adding data:', error);
        });
      Axios.post('https://internee-web.vercel.app/state', {"checkout"})
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error adding data:', error);
        });
    }
  };

    useEffect(() => {
    fetchState();
    submithandler();
  }, []);

  return (
    <div className="background-container">
      <div className="bodylogin">
        <section>
          <div className="auth">
            <h1>{message}</h1>
            <form action="">
              {isGoodbyeVisible ? null : (
                showWelcomeMessage ? null : (
                  isCheckinVisible ? (
                    <button onClick={toggleCheckin} id="checkin" name="checkin" type="submit" value="checkin">Check-In</button>
                  ) : (
                    <button onClick={toggleCheckin} id="checkout" name="checkout" type="submit" value="checkout">Check-Out</button>
                  )
                )
              )}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
