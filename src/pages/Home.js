import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <section className='hero-container'>
        <div>
          <h3>Hello</h3>
            <p className='hero-main-desc'>Your poetry is a reflection of your thoughts and feelings—don’t keep it inside. Let your words be heard and express what’s within you.</p>
          <div className='hero-button'>
            <button> 
              <Link to="/submit">
              Compose &#8594; 
              </Link>
            </button>
            <button>
            <Link to="/post">
              Browse <span className='book-icon'>&#x1F4D6;</span>
            </Link>
            </button>
          </div>
        </div>
      </section>

      <section className='container'>
        <div className='subhero'>
          <div className='subhero-container'>
            <img className='hero-image' src="/hero-ex.png" alt="" />
            <div className='tape'>
              <img src="/tape.png" alt="" />
            </div>
            
          </div>
        </div>

        <div className='hero-desc'>
            <h1>About Heart Held</h1>
            <div className='hero-desc-sub-cont'>
              <p className='hero-desc-sub'><strong>Heart Held</strong> is a creative platform where users can share memories, write and dedicate poems, and send heartfelt letters to someone special, offering a unique space for personal expression and connection..</p>
            </div>

        </div>
      </section>
    </main>
  )
}

export default Home
