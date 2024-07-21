import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChattyImage from '../../assets/images/chatty.png';
import styles from './ChatPage.module.css';
import { FiPlus } from "react-icons/fi";

const ChatHistory = () => {
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/list');
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
        
        <FiPlus size={35} className={styles.exitButton} onClick={handleIconClick}/>
        
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
    </div>
  );
}

export default ChatHistory;

