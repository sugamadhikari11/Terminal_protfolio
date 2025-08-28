import React, { useState, useEffect } from 'react';
import TerminalBorder from './TerminalBorder';
import SessionInfo from '../hooks/sessionInfo';
import TerminalContent from './TerminalContent';
import { useTypewriter } from '../hooks/typeWriter';
import { sleep } from '../utils/terminalUtils';

// Main Terminal Component
const Terminal: React.FC = () => {
  const [connecting, setConnecting] = useState(true);
  const [showConnecting, setShowConnecting] = useState(false);
  const [showSSH, setShowSSH] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { displayText: sshText } = useTypewriter(
    "ssh guest@terminal.portfolio",
    60,
    showSSH ? 0 : 0
  );

  useEffect(() => {
    const initialize = async () => {
      await sleep(200);
      setShowConnecting(true);
      await sleep(300);
      setShowSSH(true);
      await sleep(600);
      setConnecting(false);
    };
    initialize();
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <TerminalBorder isLoading={connecting}>
      <div className="font-mono text-green-400">
        {showConnecting && (
          <div className="mb-4 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center text-yellow-400 mb-2">
              <div className="mr-2">[{connecting ? '●' : '✓'}]</div>
              <div>Establishing secure connection...</div>
              {connecting && (
                <div className="ml-2">
                  <span className="animate-pulse">⣾⣽⣻⢿⡿⣟⣯⣷</span>
                </div>
              )}
            </div>
            {connecting && (
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            )}
          </div>
        )}
        
        {showSSH && !connecting && (
          <div className="mb-2 opacity-0 animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <span className="text-white">user@localhost:~$ </span>
            <span className="text-cyan-400">{sshText}</span>
            <span className="animate-pulse text-green-400">|</span>
          </div>
        )}
        
        {!connecting && <SessionInfo onComplete={handleAuthentication} />}
        <TerminalContent isAuthenticated={isAuthenticated} />
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </TerminalBorder>
  );
};

export default Terminal;