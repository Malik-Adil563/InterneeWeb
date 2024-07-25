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

  // Check if data for yesterday exists and delete if necessary
  const deleteYesterdayState = async () => {
    try {
      await Axios.delete('https://internee-web.vercel.app/deleteYesterdayState');
      console.log('Checked and deleted yesterday\'s state data if necessary');
    } catch (error) {
      console.error('Error deleting yesterday\'s state data:', error);
    }
  };

  // Fetch the state for the logged-in user
  const fetchState = async () => {
    try {
      const response = await Axios.get('https://internee-web.vercel.app/getState', { params: { email } });
      console.log('Fetched state data:', response.data); // Debugging

      if (Array.isArray(response.data) && response.data.length > 0) {
        const userState = response.data[0]?.state;
        console.log('User State:', userState); // Debugging

        if (userState === 'checkin') {
          setIsCheckinVisible(false);
          setMessage('Please Check-Out');
        } else {
          setIsCheckinVisible(true);
          setMessage('Please check-in');
        }
      } else {
        setIsCheckinVisible(true);
        setMessage('Please check-in');
      }
    } catch (error) {
      console.error('Error fetching state:', error);
    }
  };

  useEffect(() => {
    deleteYesterdayState();
    fetchState();
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
          }, 2000);
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
          }, 2000);
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
            <form>
              {isGoodbyeVisible ? null : (
                showWelcomeMessage ? null : (
                  isCheckinVisible ? (
                    <button onClick={toggleCheckin} id="checkin" name="checkin" type="button">Check-In</button>
                  ) : (
                    <button onClick={toggleCheckin} id="checkout" name="checkout" type="button">Check-Out</button>
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
