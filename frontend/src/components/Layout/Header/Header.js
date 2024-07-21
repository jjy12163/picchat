import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import defaultProfile from '../../../assets/images/profile.jpg';

const Header = () => {
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch('/..');
        if (response.ok) {
          const data = await response.json();
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        } else {
          console.error('오류..', response.statusText);
        }
      } catch (error) {
        console.error('오류..', error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST', 
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('로그아웃 실패:', response.statusText);
      }
    } catch (error) {
      console.error('로그아웃 중 에러:', error);
    }
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
