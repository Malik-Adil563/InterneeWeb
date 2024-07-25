import React from 'react';

const Admin = () => {

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
      </div>
    </section>
  </div>
</div>
  );
};

export default Admin;
