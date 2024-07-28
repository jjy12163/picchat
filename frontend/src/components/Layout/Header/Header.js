import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import defaultProfile from '../../../assets/images/profile.jpg';

const Header = () => {

 const navigate = useNavigate();
 const [profileImage, setProfileImage] = useState(defaultProfile);

 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/', {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized');
          return;
        }
        throw new Error('네트워크 오류');
      }
      const data = await response.json();
      if (data.profile_image) {
        setProfileImage(data.profile_image);
      }
    } catch (error) {
      console.error('사용자 정보를 불러오는 데 실패했습니다.', error);
    }
  };

  fetchUserData();
}, []);

const handleLogout = () => {
  fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(response => {
      if (response.ok) {
        navigate('/login');
      } else {
        throw new Error('로그아웃 실패');
      }
    })
    .catch(error => {
      console.error('로그아웃 실패:', error);
    });
};


  return (
    <header className={styles.header}>
      <Link to="/start" className={styles.logo}>
        picchat
      </Link>
      <div className={styles.buttoncontainer}>
        <button className={styles.logoutbutton} onClick={handleLogout}>
          로그아웃
        </button>
        <Link to="/mypage" className={styles.mypagebutton}>
          마이페이지
        </Link>
        <div className={styles.profileContainer}>
          <Link to="/mypage">
            <img
              src={profileImage}
              alt="Profile"
              className={styles.profilePic}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
