import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/inc/Header';
import PostFeed from './pages/PostFeed';
import Home from './pages/Home';
import Footer from './components/inc/Footer';
import PostWrapper from './components/PostWrapper';
import PostDetails from './pages/PostDetails';


function App() {
  return (
    <Router>
      <div className="App">
      <Header />
        <main>
          <Routes>
          <Route path="/" element={<Home/>} />
            <Route path="/submit" element={<PostWrapper />} />
            <Route path="/post" element={<PostFeed />} />
            <Route path="/post/:id" element={<PostDetails />} /> 
          </Routes>
        </main>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
