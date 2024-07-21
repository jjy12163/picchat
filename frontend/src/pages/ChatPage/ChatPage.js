import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChattyImage from '../../assets/images/chatty.png';
import styles from './ChatPage.module.css';
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuImage } from "react-icons/lu";

const ChatPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleFinish = () => {
    // 상담 끝내면 내용 저장하고 리뷰 페이지로 넘어감
    axios.post('/chat/save', { message })
      .then(() => {
        navigate('/review');
      })
      .catch(error => {
        console.error('There was an error saving the chat history!', error);
      });
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {

    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <img
          src={ChattyImage}
          className={styles.chattyImage}
          alt='Chatty Profile'
        />
        <div className={styles.chattyInfo}>
          <div className={styles.chattyName}>Chatty</div>
          <div className={styles.chattyHello}>How are you?</div>
        </div>
        <button className={styles.finishButton} onClick={handleFinish}>finish</button>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.dateAndTime}>Nov 30, 2023, 9:41 AM</div>
        <div className={styles.chattyTextContainer}>
          <div className={styles.chattyText}>How does it work?</div>
        </div>
        <div className={styles.userTextContainer}>
          <div className={styles.userText}>Booom!</div>
        </div>
      </div>

      <div className={styles.footer}>
        <input 
          type='text'
          name='userMessage'
          size={500}
          className={styles.inputText}
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={styles.iconContainer}>
          <MdOutlineKeyboardVoice className={styles.icon} size={20} onClick={handleVoiceInput} />
          <label htmlFor="imageUpload">
            <LuImage className={styles.icon} size={20} />
          </label>
          <input 
            type="file" 
            id="imageUpload" 
            className={styles.imageInput} 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

