import React from 'react';
import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Content from './components/content';

function App() {
  return (
    <div className="p-0 m-0 flex flex-col">
      <Navbar />
      <Content />
      <Content />
      <Footer/>
    </div>
  );
}

export default App;
