import React from 'react';

import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

import './header.css';
import Cookies from 'js-cookie';

import { Link, Navigate} from 'react-router-dom';

function Header() {
  const location = useLocation();
  const showSearchBarAndButton = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <header className='header'>
      <h1>Picture Perfect</h1>
      {/* {showSearchBarAndButton && (
        <div>
          <button  className="new-post-button">
            <FontAwesomeIcon icon={faPlus} className="icon" />
            New Post
          </button>
        </div>
      )} */}
      {/* {showSearchBarAndButton && (
        <div className="header-right">
          <input type="text" placeholder="Images, #tags, @users" className="search-bar"  />
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} className="icon" />
          </button>
        </div>
      )} */}
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        
        </ul>
      </nav>
    </header>
  );
}

export default Header;




