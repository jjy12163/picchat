import React, { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegImage } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
import styles from './MainPage.module.css';

const MainPage = () => {
  const imageInput = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
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
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('image', file);

      // 이미지 업로드 후 분석 시작 (loading)
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/face_image/upload_and_analyze', { 
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          navigate('/analyze', { state: { 
            imageUrl: reader.result,
            dominantEmotion: data.dominant_emotion,
            emotions: data.emotions
          } });
        } else {
          console.error('파일 업로드 및 분석 실패:', response.statusText);
        }
      } catch (error) {
        console.error('파일 업로드 및 분석 중 에러:', error);
      } finally {
        // 이미지 분석 완료 
        setLoading(false);
      }
    } else {
      alert('이미지 파일을 업로드해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
          <div className={styles.loadingContainer}>
          <RiRobot2Fill 
            className={styles.icon}
            size={120}
          />
          <div className={styles.text}>사진을 분석 중입니다...</div>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <div className={styles.imageContainer}> 
            {preview ? (
              <img src={preview} alt="미리보기" className={styles.previewImage} />
            ) : (
              <FaRegImage
                className={styles.icon}
                size={120}
              />
            )}
          </div>
          <input 
            type="file" 
            accept=".jpg, .jpeg, .png" 
            hidden 
            ref={imageInput} 
            onChange={onChangeImageUpload} 
          />
          <button onClick={onClickImageUpload} className={styles.uploadButton}>
            사진 업로드하기
          </button>
        </div>)}
    </div>
  );
}

export default MainPage;
