import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function ShowCheckin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Axios.get("https://internee-web.vercel.app/getCheckin")
      .then(response => setUsers(response.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th></th>
            <th>Time</th>
            <th></th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.date}</td>
              <td>{""}</td>
              <td>{user.time}</td>
              <td>{""}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShowCheckout() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Axios.get("https://internee-web.vercel.app/getCheckout")
      .then(response => setUsers(response.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th></th>
            <th>Time</th>
            <th></th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.date}</td>
              <td>{""}</td>
              <td>{user.time}</td>
              <td>{""}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Admin = () => {
  const [showCheckin, setShowCheckin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleShowUsers = () => {
    window.open('https://internee-web.vercel.app/generateExcel', '_blank');
  };

  return (
    <div className="background-container">
      <div className="bodylogin">
        <section>
          <div className="auth">
            <h1>Welcome to Octaloop Technologies</h1>
            <button onClick={handleShowUsers} type='submit'>Generate All Data</button>
            <button onClick={() => setShowCheckin(!showCheckin)} type='submit'>SHOW Check-In</button>
            {showCheckin && <ShowCheckin />}
            <button onClick={() => setShowCheckout(!showCheckout)} type='submit'>SHOW Check-Out</button>
            {showCheckout && <ShowCheckout />}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
