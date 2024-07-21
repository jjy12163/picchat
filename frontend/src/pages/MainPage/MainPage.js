import React, { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegImage } from "react-icons/fa6";
import styles from './MainPage.module.css';

const MainPage = () => {
  const imageInput = useRef(null);
  const [preview, setPreview] = useState(null);
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
      formData.append('file', file);

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('파일 업로드 성공:', data);
          navigate('/analyze', { state: { data } });
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

  return (
    <div className={styles.container}>
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
      </div>
    </div>
  );
}

export default MainPage;
