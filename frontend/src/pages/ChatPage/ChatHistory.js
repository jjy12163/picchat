import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ChattyImage from '../../assets/images/chatty.png';
import styles from './ChatPage.module.css';
import { FiPlus } from "react-icons/fi";

const ChatHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatHistory, setChatHistory] = useState([]);
  const [dateTime, setDateTime] = useState('');
  const chatId = location.state?.chatId || '';

  const handleIconClick = () => {
    navigate('/list');
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/list/${chatId}`);
        const chatData = response.data;
        setChatHistory(chatData.dialog);
        setDateTime(chatData.date);
      } catch (error) {
        console.error('대화 내용을 가져올 수 없습니다:', error);
      }
    };

    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId]);

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
        
        <FiPlus size={35} className={styles.exitButton} onClick={handleIconClick}/>
        
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.dateAndTime}>{dateTime}</div>
        {chatHistory.map((line, index) => (
          <div
            key={index}
            className={line.startsWith('User:') ? styles.userTextContainer : styles.chattyTextContainer}
          >
            <div className={line.startsWith('User:','') ? styles.userText : styles.chattyText}>
              {line.replace('Chatty:', '').replace('User:', '')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatHistory;

