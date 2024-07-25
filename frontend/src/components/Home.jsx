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

  // Fetch the state for the logged-in user
  const fetchState = () => {
    Axios.get(`https://internee-web.vercel.app/getState`, { params: { email } })
      .then(response => {
        const userState = response.data.state; // Adjust based on your API response structure

        if (userState === 'checkin') {
          setIsCheckinVisible(false);
          setMessage('Please Check-Out');
        } else {
          setIsCheckinVisible(true);
          setMessage('Please check-in');
        }
      })
      .catch(error => {
        console.error('Error fetching state:', error);
      });
  };

  useEffect(() => {
    fetchState(); // Fetch the state when the component mounts
  }, []);

  const toggleCheckin = (event) => {
    event.preventDefault();
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = `${year}-${month}-${date}`;
    const currentTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    const data = { date: currentDate, time: currentTime, email };

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

      Axios.post('https://internee-web.vercel.app/state', { email, state: "checkin" })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error updating state:', error);
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

      Axios.post('https://internee-web.vercel.app/state', { email, state: "checkout" })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error updating state:', error);
        });
    }
  };

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
