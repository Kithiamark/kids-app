import React from 'react';
import './../styles/friends.css';

const friends = [
  { name: 'Leo', status: 'online' },
  { name: 'Sophie', status: 'online' },
  { name: 'Max', status: 'away' }
];

const OnlineFriends = () => {
  return (
    <div className="online-friends">
      <h4>Online Friends</h4>
      <ul>
        {friends.map((friend, idx) => (
          <li key={idx}>
            <span className={`status-dot ${friend.status}`}></span>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineFriends;
