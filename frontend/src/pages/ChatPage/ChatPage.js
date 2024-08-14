import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import formatDateTime from '../../components/formatDateTime';
import ChattyImage from '../../assets/images/chatty.png';
import styles from './ChatPage.module.css';
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuSend } from "react-icons/lu";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [dateTime, setDateTime] = useState('');
  const { dominantEmotionKorean } = location.state || {};

  const chatContainerRef = useRef(null); 
 
  useEffect(() => {
    const now = new Date();
    setDateTime(formatDateTime(now));
  }, []);

  useEffect(() => {
    // 새로운 메시지가 추가될 때마다 스크롤을 가장 아래로 이동
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]); 

  useEffect(() => {
    if (!dominantEmotionKorean) return;

    // 초기 응답 생성 
    const fetchInitialResponse = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/chat', { message: dominantEmotionKorean });
        const gptResponse = response.data.response;
        setChatHistory([{ sender: 'gpt', text: gptResponse }]); 
      } catch (error) {
        console.error('초기 응답을 받을 수 없습니다:', error);
      }
    };

    fetchInitialResponse();
  }, [dominantEmotionKorean]);

  const handleFinish = async () => {
    try {
      // `chatHistory`를 전송할 수 있도록 변환
      const dialog = chatHistory.map(chat => `${chat.sender === 'user' ? 'User: ' : 'Chatty: '}${chat.text}`).join('\n');
      
      await axios.post('http://localhost:5000/api/chat/save', { dialog });
      navigate('/review');
    } catch (error) {
      console.error('채팅 기록이 저장되지 않았습니다', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setChatHistory([...chatHistory, { sender: 'user', text: message }]);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message });
      const gptResponse = response.data.response;
      setChatHistory(prevHistory => [...prevHistory, { sender: 'gpt', text: gptResponse }]);
    } catch (error) {
      console.error('메세지를 전송할 수 없습니다:', error);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
    recognition.start();
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
        <button className={styles.finishButton} onClick={handleFinish}>Finish</button>
      </div>

      <div className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.dateAndTime}>{dateTime}</div>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={chat.sender === 'user' ? styles.userTextContainer : styles.chattyTextContainer}
          >
            <div className={chat.sender === 'user' ? styles.userText : styles.chattyText}>
              {chat.text}
            </div>
          </div>
        ))}
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}  // Enter 키로 메세지 전송 가능
        />
        <div className={styles.iconContainer}>
          <MdOutlineKeyboardVoice className={styles.icon} size={20} onClick={handleVoiceInput} />
          <LuSend className={styles.icon} size={18} onClick={handleSendMessage}/>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
