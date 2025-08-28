import React, { useState, useEffect } from 'react';
import { sleep } from '../utils/terminalUtils';
// Enhanced Password Prompt with realistic typing
interface PasswordPromptProps {
  onComplete: () => void;
}

export const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onComplete }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChars, setPasswordChars] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializePrompt = async () => {
      await sleep(800);
      setShowPrompt(true);
      
      await sleep(600);
      setShowPassword(true);
      
      // Realistic password typing with varying speeds
      const targetPassword = '********';
      for (let i = 0; i < targetPassword.length; i++) {
        await sleep(80 + Math.random() * 40); // Vary typing speed
        setPasswordChars(targetPassword.slice(0, i + 1));
      }
      
      await sleep(300);
      setAuthenticated(true);
      await sleep(700);
      onComplete();
    };

    initializePrompt();
  }, [onComplete]);

  return (
    <div className="my-4">
      {showPrompt && (
        <>
          <div className="text-white mb-2">
            guest@terminal's password:
          </div>
          {showPassword && (
            <div className="flex items-center text-white">
              <span className="text-green-400">{passwordChars}</span>
              {!authenticated && showCursor && (
                <span className="bg-green-400 w-2 h-4 ml-1 animate-pulse"></span>
              )}
            </div>
          )}
          {authenticated && (
            <div className="text-green-400 mt-2 opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Last login: {new Date().toLocaleDateString()} from 192.168.1.100
            </div>
          )}
        </>
      )}
    </div>
  );
};