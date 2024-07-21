import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdChatboxes } from "react-icons/io";
import styles from './StartPage.module.css';

const StartPage = () => {
    const navigate = useNavigate();
    const [userNames, setUserNames] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then(response => response.json())
            .then(data => setUserNames(data))
            .catch(error => console.error('Error fetching user names:', error));
    }, []);

    const buttonOnClick = () => {
        navigate('/main');
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <div className={styles.imageContainer}>
                    <IoMdChatboxes
                        className={styles.icon}
                        size={120}
                    ></IoMdChatboxes>
                </div>
                <button
                    className={styles.startButton}
                    onClick={buttonOnClick}
                >상담 시작하기</button>
                <div className={styles.userList}>
                    <h3>flask, mysql 연결 test<br></br>사용자 이름 출력 예시</h3>
                    <ul>
                        {userNames.map((userName, index) => (
                            <li key={index}>{userName}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default StartPage;
