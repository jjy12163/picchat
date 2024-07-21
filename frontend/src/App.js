import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import ChatPage from './pages/ChatPage/ChatPage';
import PicAnalyzePage from './pages/PicAnalyzePage/PicAnalyzePage';
import ReviewPage from './pages/ReviewPage/ReviewPage';
import MyPage from './pages/MyPage/MyPage';
import ChatHistory from './pages/ChatPage/ChatHistory';
import StartPage from './pages/StartPage/StartPage';
import ChatList from './pages/ChatPage/ChatList';

function App() {
  const location = useLocation();
  const noHeaderPaths = ['/chat', '/history', '/login'];

  return (
    <div>
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/analyze" element={<PicAnalyzePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/history" element={<ChatHistory />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/list" element={<ChatList />} />
      </Routes>
      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
