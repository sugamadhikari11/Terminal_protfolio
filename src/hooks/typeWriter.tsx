import { useState, useEffect } from 'react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Typing effect hook
export const useTypewriter = (text: string, speed: number = 50, delay: number = 0) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!text) return;

    const startTyping = async () => {
      if (delay > 0) {
        await sleep(delay);
      }
      setHasStarted(true);
      setIsTyping(true);
      
      for (let i = 0; i <= text.length; i++) {
        setDisplayText(text.slice(0, i));
        await sleep(speed + Math.random() * 20); // Add slight randomness
      }
      setIsTyping(false);
    };

    startTyping();
  }, [text, speed, delay]);

  return { displayText, isTyping, hasStarted };
};