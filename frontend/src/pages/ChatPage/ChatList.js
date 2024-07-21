import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ChatList.module.css';
import { CiSearch, CiFilter } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";

const ChatList = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get('/chat/history')
      .then(response => {
        setIssues(response.data);
      })
      .catch(error => {
        console.error('오류 발생함', error);
      });
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Active issues</div>
      <div className={styles.topContainer}>
        <div className={styles.searchContainer}>
          <CiSearch 
            size={25}
            className={styles.searchIcon}
          />
          <input 
            type='text'
            className={styles.inputBox}
            placeholder='Search tickets...'
          />
        </div>
        <div className={styles.filterButton}>
          <CiFilter
            size={25}
            className={styles.filterIcon}
          />
          <div className={styles.grayText}>Filter</div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.classify}>
          <div>날짜</div>
          <div>사진</div>
          <div>상담 요약</div>
        </div>
        {issues.map((issue, index) => (
          <div key={index} className={styles.listContainer}>
            <div className={styles.date}>{issue.date}</div>
            <div className={styles.userImageContainer}>
              <img 
                src={issue.image} 
                alt='User' 
                className={styles.userImage} 
              />
            </div>
            <div className={styles.summary}>{issue.summary}</div>
            <IoIosMore 
              color='gray'  
              className={styles.moreIcon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
