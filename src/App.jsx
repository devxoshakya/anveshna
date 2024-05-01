import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import About from './pages/about';


function App() {
  return (<Router>
    <div className="p-0 m-0 flex flex-col">
      <Navbar />
      <div style={{ minHeight: '40rem' }}>
      <Routes>
      <Route path='/about' element={<About />}/>
      </Routes>
      </div>
      <Footer/>
    </div>
  </Router>);
}

export default App;
