# Pic Chat

## 목차
1. [프로젝트 개요](#프로젝트-개요)
   - [제작 이유](#제작-이유)
   - [개발 기간](#개발-기간)
   - [서비스 목표](#서비스-목표)
   - [주요 기능](#주요-기능)
   - [시연 영상](#시연-영상)
2. [기술 스택](#기술-스택)
3. [플로우차트](#플로우차트)
4. [ERD](#데이터베이스)
5. [기능 상세 설명](#기능-상세-설명)
6. [팀원 소개](#팀원-소개)


## 프로젝트 개요
### 제작 이유
- 현대 사회에서 사람들이 받는 스트레스를 줄이기 위한 개인 맞춤형 서비스 중 접근성과 편리성을 고려하여 얼굴 인식 기술과 인공지능을 활용한 심리 상담 서비스를 제작하기로 하였습니다.

### 개발 기간 
- 2024.05.23 ~ 2024.08.20 (3개월) 

### 서비스 목표
- 사용자가 자신의 감정을 인식하고 그에 맞는 조언을 받는 과정을 통해 사용자의 감정 인식 수준을 높이고 성장하는 데에 도움을 주는 것을 목표로 합니다.

### 주요 기능
- **사용자의 사진 분석 후 감정 키워드 도출**
- **해당 감정 키워드를 바탕으로 심리 상담 진행** (`채티` 챗봇 사용)

### 시연 영상
- [Demo](https://youtu.be/3Vgwy5BEZkw)

<br>

## 기술 스택

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.16.0-339933?style=flat&logo=node.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.7.3-5A29E4?style=flat&logo=axios&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white) 

![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?style=flat&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12.4-3776AB?style=flat&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-9.0.0-4479A1?style=flat&logo=mysql&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-1.26.4-013243?style=flat&logo=numpy&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=flat&logo=openapiinitiative&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat&logo=opencv&logoColor=white)
![CNN](https://img.shields.io/badge/CNN-FF6F00?style=flat&logoColor=white)
![DeepFace](https://img.shields.io/badge/DeepFace-FF69B4?style=flat&logo=deepface&logoColor=black)

![VS Code](https://img.shields.io/badge/VS_Code-1.92.2-007ACC?style=flat&logo=visual-studio-code&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white)


<br>

## 플로우차트
<img src="https://github.com/user-attachments/assets/a5a30771-1473-48fc-897e-205eeb84a7c4" width="800"/>


## 데이터베이스
<img src="https://github.com/user-attachments/assets/29683d40-ed83-4842-ad7e-9759cbdd5b6e" alt="ERD" width="500"/>

<br><br>

## 기능 상세 설명 
### 로그인 및 회원가입 
| <img src="https://github.com/user-attachments/assets/4b0e04d1-a3ea-4a73-afe8-a4a839bc1ee8" alt="loginpage" width="500"/> | 
|:---------------------------------:|
| 구글 로그인을 통한 로그인 및 회원가입|                                  


### 사진 업로드 및 분석 
| <img src="https://github.com/user-attachments/assets/5a9c0c28-2e86-4ba0-a8d4-64e6afd8c1db" alt="uploadpage" width="500" /> | <img src="https://github.com/user-attachments/assets/fe8f0377-05d1-4028-8de3-3b0ae5fdf09c" alt="analyzing" width="500"/>
|:---------------------------------:|:------------------:|
| 상담을 진행하기 위해 <br> 사용자의 감정이 드러나는 사진을 업로드 | 업로드한 사진에서 감정 키워드 추출을 위한 분석 진행 |                                 


### 감정 키워드 추출
| <img src="https://github.com/user-attachments/assets/db395ab5-aee7-4125-af36-f4131616607a" alt="resultpage" width="500"/> | 
|:---------------------------------:|
| 표정분석모델로부터 추출한 감정 키워드 출력|       


### 챗봇과의 심리상담
| <img src="https://github.com/user-attachments/assets/103c49fd-53ed-4904-ac5f-6355b29e5645" alt="chatpage" width="500"/> | 
|:---------------------------------:|
| 감정 키워드를 기반으로 심리 상담 진행|  

### 만족도 조사 
| <img src="https://github.com/user-attachments/assets/2a2fbb1c-9793-473e-adbc-4cb2b2f0c862" alt="feedback" width="500"/> | 
|:---------------------------------:|
| 상담 종료 후 만족도 조사 진행 <br> (good/bad/건너뛰기 중 1 선택)|  


### 마이페이지
| <img src="https://github.com/user-attachments/assets/4ddc1fbc-5f3f-4373-b510-2c7171261072" alt="mypage" width="500"/> |
|:---------------------------------:|
| 닉네임 변경, 상담 기록 확인, 회원 탈퇴 가능 |

### 상담 기록 확인 

| <img src="https://github.com/user-attachments/assets/ef9f3113-ea48-4e86-8fc7-edf9ef789da5" alt="chatlist" width="500" /> | <img src="https://github.com/user-attachments/assets/5443b9c9-5995-4617-bdcf-bc829d1b6105" width="500" alt="chathistory"/>
|:----------------:|:-------:|
| 챗봇과의 상담 기록 확인 (목록)|특정 기록 선택 열람|

<br>

## 팀원 소개

- [전지연](https://github.com/jjy12163)
  - 팀장(PM): 정기회의 및 Notion & Github 관리 
  - 백엔드 개발: 챗봇 개발, ERD 설계 
  - 디자인: 화면 디자인 (Figma) 
- [류현주](https://github.com/h213yun)
  - 백엔드 개발: 로그인/회원가입, 회원탈퇴, 챗봇 개발 및 채팅 진행/저장, 이미지 분석/저장, 닉네임 변경, ERD 설계 
  - 프론트엔드 개발: 프론트엔드 전체 개발 
  - 디자인: 화면 디자인 (CSS)
- [정여원](https://github.com/Onedory)
  - AI 개발: 심리상담 챗봇 모델 제작, OpenAPI 개발
  - 백엔드 개발: ERD 설계
  - 디자인: 화면 디자인 (Figma) 
  - 발표자료(PPT) 제작
- 임은서
  - AI 개발: 심리상담 챗봇 모델 제작, OpenAPI 개발
  - 백엔드 개발: ERD 설계
  - 디자인: 화면 디자인 (Figma)
  - 발표자료(PPT) 제작
 
<br><br>

## 표정 분석 이미지 출처

- [이미지1](https://www.ohmynews.com/NWS_Web/View/img_pg.aspx?CNTN_CD=IE001385937): 오마이뉴스(OhmyNews)
- [이미지2](https://isplus.com/article/view/isp201611180189): 일간스포츠(Ilgan Sports)
- [이미지3](https://ent.sbs.co.kr/news/article.do?article_id=E10008084640): SBS 엔터테인먼트 뉴스(SBS Entertainment News)


