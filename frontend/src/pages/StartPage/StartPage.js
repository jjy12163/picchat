import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdChatboxes } from "react-icons/io";
import styles from './StartPage.module.css';

const StartPage = () => {
    const navigate = useNavigate();

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
            </div>
        </div>
    );
}

export default StartPage;
