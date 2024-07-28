import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdChatboxes } from "react-icons/io";
import styles from './StartPage.module.css';

const StartPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const buttonOnClick = async() => {
        try {
            const response = await fetch('http://localhost:5000/api/user/', {
                credentials: 'include'
            });
            if (response.status === 401) {
                navigate('/login');
                return;
            }
            if (!response.ok) {
                throw new Error('네트워크 오류');
            }
            const data = await response.json();
            if (data.email) {
                navigate('/main');
            } else {
                navigate('/login');
            }
        } catch (error) {
            setError(error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.logo}>picchat</div>
            <div className={styles.container}>
                <div className={styles.buttonContainer}>
                    <div className={styles.imageContainer}>
                        <IoMdChatboxes
                            className={styles.icon}
                            size={120}
                        />
                    </div>
                    <button
                        className={styles.startButton}
                        onClick={buttonOnClick}
                    >
                        상담 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StartPage;
