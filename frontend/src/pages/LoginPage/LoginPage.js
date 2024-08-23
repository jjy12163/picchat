import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import LoginButton from '../../assets/images/googleLogin.png';

const LoginPage = () => {
  const navigate = useNavigate();

  // 구글 로그인 페이지 이동
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google`;
  };
  
  const handleLogoClick = () => {
    navigate('/start');
  };

  return (
    <div className={styles.root}>
      <div className={styles.logo} onClick={handleLogoClick}>picchat</div>
      <div className={styles.container}>
        <div className={styles.bold}>Create an account</div>
        <div className={styles.text}>Enter your email to sign up or sign in for this app</div>
        <img
          src={LoginButton}
          alt='loginButton'
          className={styles.loginButton}
          onClick={handleLogin}
        />
        <div className={styles.text}>By clicking continue, you agree to our Terms of Service and Privacy Policy</div>
      </div>
    </div>
  );
}

export default LoginPage;
