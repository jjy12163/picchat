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
import PrivateRoute from './components/PrivateRoute';

function App() {
  const location = useLocation();
  const noHeaderPaths = ['/chat', '/history', '/login', '/start'];

  return (
    <div>
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Navigate replace to="/start" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<PrivateRoute element={<MainPage />} />} />
        <Route path="/chat" element={<PrivateRoute element={<ChatPage />} />} />
        <Route path="/analyze" element={<PrivateRoute element={<PicAnalyzePage />} />} />
        <Route path="/review" element={<PrivateRoute element={<ReviewPage />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />}/>} />
        <Route path="/history" element={<PrivateRoute element={<ChatHistory />}/>} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/list" element={<PrivateRoute element={<ChatList />}/>} />
      </Routes>
      {!noHeaderPaths.includes(location.pathname) && <Footer />}
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
