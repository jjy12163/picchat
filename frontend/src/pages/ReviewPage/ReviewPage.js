import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReviewPage.module.css';
import ThumbsUp from '../../assets/images/thumbsup.png';
import ThumbsDown from '../../assets/images/thumbsdown.png';

const ReviewPage = () => {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/start');
  };

  const handleFeedback = (feedback) => {
    axios.post('/chat/evaluate', { feedback })
      .then(response => {
        console.log('Feedback sent successfully:', response.data);
        navigate('/start');
      })
      .catch(error => {
        console.error('Error sending feedback:', error);
      });
  };

  return (
    <div className={styles.root}>
      <div className={styles.title}>상담에 만족하셨나요?</div>
      <div className={styles.iconContainer}>
        <img
          src={ThumbsUp}
          alt='thumbsUp'
          className={styles.thumbsUp}
          onClick={() => handleFeedback('좋아요')}
        />
        <img
          src={ThumbsDown}
          alt='thumbsDown'
          className={styles.thumbsDown}
          onClick={() => handleFeedback('싫어요')}
        />
      </div>
      <button className={styles.button} onClick={handleSkip}>건너뛰기</button>
    </div>
  );
}

export default ReviewPage;
