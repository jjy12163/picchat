import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PicAnalyzePage.module.css';

const PicAnalyzePage = () => {
  const location = useLocation();
  const {emotions, imageUrl} = location.state || {};
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
  
  const filteredEmotions = { ...emotions };
  console.log('감정 분석 결과:', emotions);

  delete filteredEmotions.neutral;
  const dominantEmotion = Object.keys(filteredEmotions).reduce((a, b) => filteredEmotions[a] > filteredEmotions[b] ? a : b);
  const dominantEmotionKorean = "이것은 초기 응답 요청 메세지입니다. 사용자는 " + keywordMap[dominantEmotion] + "라는 감정을 느끼고 있습니다.";

  const handleStartChat = () => {
      navigate('/chat', { state: { dominantEmotionKorean } })
  };
  
  const handleDoLater = () => {
    navigate('/start');
  };

  return (
    <div className={styles.root}>
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                className={styles.image}
                alt='uploaded'
              />
            </div>
            <div className={styles.text}>상담을 시작하시겠습니까?</div>
          </div>
          <div className={styles.tagContainer}>
            {Object.keys(emotions).map((emotion) => (
              <span 
                key={emotion} 
                className={emotion === dominantEmotion ? styles.tagselected : styles.tagdefault}
              >
                {keywordMap[emotion]}
              </span>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleDoLater}>다음에 하기</button>
            <button className={styles.button} onClick={handleStartChat}>상담 시작하기</button>
          </div>
        </div>
    </div>
  );
}

export default PicAnalyzePage;
