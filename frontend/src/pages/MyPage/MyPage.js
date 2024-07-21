import React, { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import defaultProfile from '../../assets/images/profile.jpg';

const MyPage = () => {
  const imageInput = useRef(null);
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [username, setUsername] = useState('Helena Hills');
  const [newUsername, setNewUsername] = useState(username);
  const navigate = useNavigate();

  const onClickImageUpload = useCallback(() => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  }, []);

  const onChangeImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/profile/update_picture', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('파일 업로드 성공:', data);
        } else {
          console.error('파일 업로드 실패:', response.statusText);
        }
      } catch (error) {
        console.error('파일 업로드 중 에러:', error);
      }
    } else {
      alert('이미지 파일을 업로드해주세요.');
    }
  };

  const onSaveChanges = async () => {
    if (newUsername !== username) {
      try {
        const response = await fetch('/profile/update_nickname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newUsername }),
        });

        if (response.ok) {
          console.log('닉네임 업데이트 성공');
          setUsername(newUsername);
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
      const response = await fetch('/delete_account', {
        method: 'DELETE',
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
            src={profileImage} 
            alt="Profile"
            className={styles.profilePic}
          />
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.googleName}>
            {username}
          </div>
          <input 
            type="file" 
            accept=".jpg, .jpeg, .png" 
            multiple 
            hidden 
            ref={imageInput} 
            onChange={onChangeImageUpload} 
          />
          <button 
            onClick={onClickImageUpload} 
            className={styles.uploadButton}
          > Change profile photo </button>
        </div>
      </div>

      <div className={styles.inputContainer}>
        <span className={styles.text}>Username</span> 
        <input 
          type='text' 
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <span className={styles.text}>Email</span>
        <input type='text' value="helena.hills@example.com" disabled/>
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
