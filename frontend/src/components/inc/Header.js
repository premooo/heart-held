import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
        <nav className='navbar-links'>
        <li className='header-title'><Link to="/">Heart Held</Link></li>
            <ul>
                <li><Link to="/submit">Compose</Link></li>
                <li><Link to="/post">Browse</Link></li>
            </ul>
        </nav>
      <div>
        <h3>support</h3>
      </div>

      
    
    </header>
  );
};



export default Header;