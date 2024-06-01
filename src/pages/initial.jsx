import { useScroll, useTransform } from "framer-motion";
import React, {useEffect, useRef} from "react";
import { GoogleGeminiEffect } from "../components/ui/google-gemini-effect.tsx";
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleGeminiEffectDemo = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  let isMobile = false;
  React.useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = '/home';
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const scrollAnimationFrame = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate the scroll position as a percentage
      const scrollPosition = (scrollTop + windowHeight) / documentHeight;

      // If the scroll position is 98% or more, navigate to /home
      if (scrollPosition >= 0.98) {
        navigate('/home');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);

  useEffect(() => {
    // Function to scroll the whole page in 10 seconds
    const scrollPage = () => {
      const startTime = performance.now();
      const duration = 10000; // 10 seconds
      const startPosition = window.scrollY;
      const endPosition = document.documentElement.scrollHeight - window.innerHeight;

      const scrollStep = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const position = startPosition + (endPosition - startPosition) * progress;
        window.scrollTo(0, position);

        if (progress < 1) {
          scrollAnimationFrame.current = requestAnimationFrame(scrollStep);
        }
      };

      scrollAnimationFrame.current = requestAnimationFrame(scrollStep);
    };

    // Scroll the page as soon as it loads
    scrollPage();

    // Function to stop scrolling on "Esc" key press
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (scrollAnimationFrame.current) {
          cancelAnimationFrame(scrollAnimationFrame.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      if (scrollAnimationFrame.current) {
        cancelAnimationFrame(scrollAnimationFrame.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Reset the scroll position when navigating to /home
    if (location.pathname === '/home') {
      window.scrollTo(0, 0);
    }
  }, [location]);


  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);


  

  return (
    
    <div
      className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-0 top-[-40px] overflow-clip"
      ref={ref} 
      style={{ visibility: isMobile ? 'none' : 'visible' }}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="Google Gemini Effect"
      />
    </div>
  );
}
export default GoogleGeminiEffectDemo;