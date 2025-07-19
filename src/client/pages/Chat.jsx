import React, { useState } from 'react';
import '../styles/Chat.css';

const mockMessages = [
  { id: 1, sender: 'Jenny', text: 'Hey there! ✨', time: '08:12 AM' },
  { id: 2, sender: 'Liam', text: 'Ready for today’s quiz?', time: '08:13 AM' },
];

export default function Chat() {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, sender: 'You', text: newMessage, time: 'Now' },
    ]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">📢 Kids Bible Chat</h1>

      <div className="chat-box">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender === 'You' ? 'chat-mine' : 'chat-other'}`}>
            <div className="chat-bubble">
              <strong>{msg.sender}</strong>: {msg.text}
              <span className="chat-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send ✉️</button>
      </div>
    </div>
  );
}
