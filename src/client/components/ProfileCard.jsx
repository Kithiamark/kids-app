import React from 'react';
import './../styles/profile.css';

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <img src="assets/images/kid-avatar.png" alt="Profile" />
      <h3>Hi, Ellie!</h3>
      <p>Progress: 5/10 Lessons</p>
    </div>
  );
};

export default ProfileCard;
