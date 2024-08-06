import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';

const MyPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    nickname: '',
    profile_image: '',
  });
  const [newNickname, setNewNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }, 
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            username: data.username,
            email: data.email,
            nickname: data.nickname,
            profile_image: data.profile_image
          });
          setNewNickname(data.nickname);
        } else {
          console.error('사용자 정보를 가져오지 못했습니다:', response.statusText);
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는 도중 오류 발생:', error);
      }
    };
    fetchUserData();
  }, []);


  const onSaveChanges = async () => {
    if (newNickname !== userData.nickname) {
      try {
        const response = await fetch('http://localhost:5000/api/user/update_nickname', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials:'include',
          body: JSON.stringify({ nickname: newNickname }),
        });

        if (response.ok) {
          console.log('닉네임 업데이트 성공');
          setUserData((prevData) => ({
            ...prevData,
            nickname: newNickname,
          }));
        } else {
          console.error('닉네임 업데이트 실패:', response.statusText);
        }
      } catch (error) {
        console.error('닉네임 업데이트 중 에러:', error);
      }
    }
  };

  const onDeleteAccount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/delete_account', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('탈퇴 완료');
        navigate('/login');
      } else {
        console.log('탈퇴 실패:', response.statusText);
      }
    } catch (error) {
      console.error('탈퇴 오류..:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Profile</h2>

      <div className={styles.infoContainer}>
        <div className={styles.profilePicContainer}>
          <img
            src={userData.profile_image} 
            alt="Profile"
            className={styles.profilePic}
          />
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.googleName}>
            {userData.username}
          </div>
        </div>
      </div>

      <div className={styles.inputContainer}>
        <span className={styles.text}>Nickname</span> 
        <input 
          type='text' 
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />
        <span className={styles.text}>Email</span>
        <input type='text' value={userData.email} disabled/>
      </div>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.historyButton}
          onClick={() => navigate('/history')}
        > 상담 기록 보기 </button>
        <button 
          className={styles.pwButton}
          onClick={onSaveChanges}
        > 저장하기 </button>
      </div>
      <button 
        className={styles.deleteAccountButton}
        onClick={onDeleteAccount}
      >탈퇴하기</button>
    </div>
  );
}

export default MyPage;
