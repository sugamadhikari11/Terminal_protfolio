import React, { useState, useEffect } from 'react';
import { sleep } from '../utils/terminalUtils';

interface PasswordPromptProps {
  onComplete: () => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onComplete }) => {
  const [input, setInput] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const passwordLength = 8; // Fixed password length
  
  useEffect(() => {
    const initializePrompt = async () => {
      // Wait before showing the prompt
      await sleep(1000);
      setShowPrompt(true);
      
      // Auto-complete password input after delay
      await sleep(500);
      setShowPassword(true);
      
      // Type password asterisks one by one
      for (let i = 1; i <= passwordLength; i++) {
        setInput('*'.repeat(i));
        await sleep(100); // Consistent timing between characters
      }
      
      await sleep(200); // Pause before authentication
      setAuthenticated(true);
      
      await sleep(500);
      onComplete();
    };
    
    initializePrompt();
  }, [onComplete]);

  return (
    <div className="my-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
      {showPrompt && (
        <>
          <div className="prompt-text">guest@terminal's password:</div>
          {showPassword && (
            <div className="password-field flex items-center">
              <span className="password-hidden">{input}</span>
              <span className={authenticated ? "hidden" : "cursor"}></span>
            </div>
          )}
          {authenticated && (
            <div className="success-text my-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {'>'} Access granted.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PasswordPrompt;
