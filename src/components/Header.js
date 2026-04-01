import React from 'react';

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="header-search"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="action-button notification-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 13h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6ZM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3Z" />
            </svg>
            <span className="notification-badge">3</span>
          </button>
          
          <button className="action-button settings-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
              <path d="M10 4a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 15h12a1 1 0 0 0 .707-1.707L16 13.586V10a6 6 0 0 0-6-6Z"/>
            </svg>
          </button>
        </div>

        <div className="user-menu">
          <div className="user-avatar-large">
            <span className="avatar-text">U</span>
          </div>
          <div className="user-dropdown">
            <span className="user-name">User</span>
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
