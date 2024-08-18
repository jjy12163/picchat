import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ChatList.module.css';
import { CiSearch } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";

const ChatList = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]); // 검색 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 메뉴
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const issuesPerPage = 5; 
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/chat/list')
      .then(response => {
        const newData = response.data.map(issue => {
          const [date, time] = issue.date.split(' ');
          return {
            ...issue,
            date,
            time,
            summary: issue.summary.split('\n'),
          };
        });
        setIssues(newData);
        setFilteredIssues(newData);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error('오류 발생함', error);
      });
  }, []);

  const handleChatClick = (id) => {
    navigate('/history', { state: { chatId: id } });
  };
  
  const handleMoreClick = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/chat/delete/${id}`)
      .then(response => {
        const updatedIssues = issues.filter(issue => issue.id !== id);
        setIssues(updatedIssues);
        const updatedFilteredIssues = filteredIssues.filter(issue => issue.id !== id);
        setFilteredIssues(updatedFilteredIssues);
        setDropdownOpen(null);
        // 현재 페이지에 이슈가 없으면 이전 페이지로 이동
        if (updatedFilteredIssues.length <= (currentPage - 1) * issuesPerPage) {
          setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
        }
      })
      .catch(error => {
        console.error('삭제 실패:', error);
      });
  };  

  useEffect(() => {
    const filtered = issues.filter(issue => 
      issue.summary.some(line => line.includes(searchTerm)) || 
      issue.date.includes(searchTerm)
    );
    setFilteredIssues(filtered);
    setCurrentPage(1);
  }, [searchTerm, issues]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 페이지네이션 계산 
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.root}>
      <div className={styles.bodyContainer}>
        <div className={styles.title}>Chatty와의 상담 내역</div>
        <div className={styles.searchContainer}>
          <CiSearch 
            size={25}
            className={styles.searchIcon}
          />
          <input 
            type='text'
            className={styles.inputBox}
            placeholder='검색어를 입력하세요...'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.classify}>
            <div className={styles.text}>날짜</div>
            <div className={styles.text}>사진</div>
            <div className={styles.text}>요약</div>
          </div>
          {currentIssues.length > 0  ? (
            currentIssues.map((issue, index) => (
              <div key={index} className={styles.listContainer} onClick={() => handleChatClick(issue.id)}>
                <div className={styles.dateContainer}>
                  <div className={styles.dateText}>{issue.date}</div>
                  <div className={styles.timeText}>{issue.time}</div>
                </div>
                <div className={styles.userImageContainer}>
                  <img 
                    src={issue.image} 
                    alt='User' 
                    className={styles.userImage} 
                  />
                </div>
                <div className={styles.summary}>
                  {issue.summary.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
              </div>
              <div className={styles.moreIconContainer}>
                <IoIosMore 
                  color='gray'  
                  className={styles.moreIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoreClick(issue.id);
                  }}
                />
                {dropdownOpen === issue.id && (
                  <div className={styles.dropdownMenu}>
                    <div onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(issue.id);
                    }}>
                      삭제
                    </div>
                  </div>
                )}
              </div>
            </div>
          )) 
          ) : (
              <div className={styles.none}>조건에 맞는 검색 결과가 없습니다.</div>
          )}

          <div className={styles.pagination}>
            {[...Array(totalPages).keys()].map(number => (
              <div
                key={number + 1}
                className={currentPage === number + 1 ? styles.activePage : styles.pageItem}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
