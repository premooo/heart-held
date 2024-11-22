import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/inc/Header';
import PostFeed from './pages/PostFeed';
import Home from './pages/Home';
import Footer from './components/inc/Footer';
import PostWrapper from './components/PostWrapper';
import PostDetails from './pages/PostDetails';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main>
            <Helmet>
              <meta charSet="utf-8" />
              <meta
                httpEquiv="Content-Security-Policy"
                content="
                  default-src 'self'; 
                  img-src 'self' data: https://fonts.gstatic.com https://assets.codepen.io; 
                  script-src 'self' https://apis.google.com; 
                  font-src 'self' https://fonts.gstatic.com;
                  connect-src 'self' http://localhost:5000 https://heart-held-api.onrender.com; 
                  style-src 'self' https://fonts.googleapis.com; 
                  object-src 'none'; 
                  frame-src 'none';"
              />
              <meta httpEquiv="X-Frame-Options" content="deny" />
              <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
              <meta name="referrer" content="no-referrer" />
              <title>Heart Held</title>
              <meta name="description" content="Share heartfelt messages, poems, and stories." />
            </Helmet>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<PostWrapper />} />
              <Route path="/post" element={<PostFeed />} />
              <Route path="/post/:id" element={<PostDetails />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
