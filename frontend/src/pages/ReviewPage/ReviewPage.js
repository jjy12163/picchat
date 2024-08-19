import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReviewPage.module.css';
import ThumbsUp from '../../assets/images/thumbsup.png';
import ThumbsDown from '../../assets/images/thumbsdown.png';

const ReviewPage = () => {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/main');
  };

  const handleFeedback = (feedback) => {
    axios.post('http://localhost:5000/api/chat/review', { feedback })
      .then(response => {
        console.log('Feedback sent successfully:', response.data);
        navigate('/main');
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
          onClick={() => handleFeedback('good')}
        />
        <img
          src={ThumbsDown}
          alt='thumbsDown'
          className={styles.thumbsDown}
          onClick={() => handleFeedback('bad')}
        />
      </div>
      <button className={styles.button} onClick={handleSkip}>건너뛰기</button>
    </div>
  );
}

export default ReviewPage;
