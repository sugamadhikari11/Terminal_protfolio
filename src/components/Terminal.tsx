
import React, { useState, useEffect } from 'react';
import TerminalBorder from './TerminalBorder';
import PasswordPrompt from './PasswordPrompt';
import TerminalContent from './TerminalContent';
import { sleep } from '../utils/terminalUtils';

const Terminal: React.FC = () => {
  const [connecting, setConnecting] = useState(true);
  const [showConnecting, setShowConnecting] = useState(false);
  const [showSSH, setShowSSH] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Initial delay before showing anything
      await sleep(100);
      setShowConnecting(true);
      
      await sleep(100);
      setShowSSH(true);
      
      await sleep(200);
      setConnecting(false);
    };
    
    initialize();
  }, []);

  const handleAuthentication = () => {
    setAuthenticated(true);
  };

  return (
    <TerminalBorder isLoading={connecting}>
      <div className="terminal-container font-mono">
        {showConnecting && (
          <div className="connection-status opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center">
              <div className="mr-2">[{connecting ? '•' : '✓'}]</div>
              <div>Establishing secure connection</div>
              {connecting && <div className="connecting ml-2"></div>}
            </div>
            {connecting && (
              <div className="loading-bar mt-1 mb-2">
                <div className="loading-progress"></div>
              </div>
            )}
          </div>
        )}
        
        {showSSH && !connecting && (
          <div className="ssh-prompt opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="text-terminal-text">user@localhost:~$ <span className="typewriter">ssh guest@terminal</span></div>
          </div>
        )}
        
        {!connecting && <PasswordPrompt onComplete={handleAuthentication} />}
        
        <TerminalContent isAuthenticated={authenticated} />
      </div>
    </TerminalBorder>
  );
};

export default Terminal;
