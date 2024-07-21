import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.css';
import LoginButton from '../../assets/images/googleLogin.png';

const LoginPage = () => {
  const navigate = useNavigate();


  // 구글 로그인 페이지 이동 요청
  const handleLogin = () => {
    axios.get('/auth/google', { withCredentials: true })
      .then(response => {
        if (response.status === 302) {
          window.location.href = response.headers.location;
        }
      })
      .catch(error => {
        console.error('인증 실패 또는 데이터베이스 오류', error);
        alert('인증 실패 또는 데이터베이스 오류');
      });
  };


  // 콜백 처리 요청
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('code')) {
      axios.get('/auth/google/callback?code=${query.get("code")}', { withCredentials: true })
        .then(response => {
          if (response.status === 200) {
            // 인증이 성공하고, 사용자 정보를 저장한 후 ‘/start’으로 리디렉션
            navigate('/start');
          }
        })
        .catch(error => {
          console.error('인증 실패 또는 데이터베이스 오류', error);
          alert('인증 실패 또는 데이터베이스 오류');
        });
    }
  }, [navigate]);

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
