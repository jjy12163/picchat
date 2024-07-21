import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiRobot2Fill } from "react-icons/ri";
import styles from './PicAnalyzePage.module.css';
import uploadedImage from '../../assets/images/profile.jpg';

const PicAnalyzePage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const navigate = useNavigate();

  const keywordMap = {
    angry: '화남',
    disgust: '혐오',
    fear: '두려움',
    happy: '행복',
    sad: '슬픔',
    surprise: '놀람',
    neutral: '중립'
  };

  useEffect(() => {
    fetch('/analyze_emotion', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ image_path: uploadedImagePath }) 
    })
      .then(() => {
        // 분석 완료시 키워드 추출 요청 
        return fetch('/get_words');
      })
      .then(response => response.json())
      .then(data => {
        setSelectedKeyword(data.keyword);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error during the analysis process:', error);
        setLoading(false);
      });
  }, []);

    const handleStartChat = () => {
      // 새로운 창 또는 탭에서 채팅 서비스 열기 
      const chatbotUrl = 'http://localhost:3000/chatbot';
      const chatUrl = `${chatbotUrl}?feeling=${encodeURIComponent(keywords)}`;
      window.open(chatUrl, '_blank');

    {/*
      // 상담 시작하기 선택한 경우, 챗봇에게 키워드 전달 요청
      
      fetch('http://localhost:3000/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Data successfully sent to chatbot') {
         
        // 챗봇 서비스로부터 받은 응답을 사용하여 채팅 화면으로 이동
        navigate('/chat'); //, { state: { chatbotResponse: data.response } });
      } else {
        console.error('Error starting chat:', data.error);
      }
    })
    .catch(error => {
      console.error('Error starting chat:', error);
    });
    */}
  };
  
  const handleDoLater = () => {
    navigate('/start');
  };

  return (
    <div className={styles.root}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <RiRobot2Fill 
            className={styles.icon}
            size={120}
          />
          <div className={styles.text}>사진을 분석 중입니다...</div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <div className={styles.imageContainer}>
              <img
                src={uploadedImage}
                className={styles.image}
                alt='uploaded'
              />
            </div>
            <div className={styles.text}>상담을 시작하시겠습니까?</div>
          </div>
          <div className={styles.tagContainer}>
            {Object.keys(keywordMap).map((keyword) => (
              <span 
                key={keyword} 
                className={keyword === selectedKeyword ? styles.tagselected : styles.tagdefault}
              >
                {keywordMap[keyword]}
              </span>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleStartChat}>상담 시작하기</button>
            <button className={styles.button} onClick={handleDoLater}>다음에 하기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PicAnalyzePage;
