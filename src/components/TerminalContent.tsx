import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { sleep, generateBinary, generatePandaAscii, terminalCommands, getCommandDescription } from '../utils/terminalUtils';
import { Projects, Skills, Contact, Resume, Theme, AboutMe, Exit } from './index';

interface TerminalContentProps {
  isAuthenticated: boolean;
}

const TerminalContent: React.FC<TerminalContentProps> = ({ isAuthenticated }) => {
  const [showBinary, setShowBinary] = useState(false);
  const [showPanda, setShowPanda] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandOutput, setCommandOutput] = useState<JSX.Element[]>([]);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Focus input when prompt is shown
  useEffect(() => {
    if (showPrompt && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [showPrompt]);

  useEffect(() => {
    const loadResources = async () => {
      if (!isAuthenticated) return;
      
      setShowBinary(true);
      await sleep(200);
      
      await sleep(300);
      setShowPanda(true);
      
      await sleep(500);
      setShowWelcome(true);
      
      await sleep(900);
      setShowPrompt(true);
    };
    
    if (isAuthenticated) {
      loadResources();
    }
  }, [isAuthenticated]);

  const handleCommand = () => {
    if (!currentCommand.trim()) return;
    
    // Add command to history
    setCommandHistory(prev => [...prev, currentCommand]);
    setHistoryIndex(-1);
    
    // Process command
    const cmd = currentCommand.trim().toLowerCase();
    let output: JSX.Element;
    
    if (cmd === 'help') {
      output = (
        <div className="command-help mt-2 p-4 border border-white/20 rounded">
          <div className="text-sm font-bold mb-2">Available Commands:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {terminalCommands.map((cmd, idx) => (
              <div key={idx} className="command-item">
                <span className="text-terminal-command font-bold">{cmd}</span>
                <span className="text-terminal-prompt text-xs ml-2">- {getCommandDescription(cmd)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (cmd === 'clear') {
      setCommandOutput([]);
      setCurrentCommand('');
      return;
    } else if (cmd === 'about') {
      output = <AboutMe />;
    } else if (cmd === 'projects') {
      output = <Projects />;
    } else if (cmd === 'skills') {
      output = <Skills />;
    } else if (cmd === 'contact') {
      output = <Contact />;
    } else if (cmd === 'resume') {
      output = <Resume />;
    } else if (cmd === 'theme') {
      output = <Theme />;
    } else if (cmd === 'exit') {
      output = <Exit />;
    } else if (terminalCommands.includes(cmd)) {
      output = <div className="mt-2 text-white">{cmd} command executed. This feature is coming soon!</div>;
    } else {
      output = <div className="mt-2 text-terminal-error">Command not found: {cmd}. Type 'help' for available commands.</div>;
    }
    
    // Add command and output to display
    setCommandOutput(prev => [
      ...prev, 
      <div key={prev.length} className="command-entry mt-2">
        <div className="flex items-center">
          <span className="text-terminal-success mr-1">guest@terminal:~$</span>
          <span className="command-text">{currentCommand}</span>
        </div>
        {output}
      </div>
    ]);
    
    setCurrentCommand('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className="p-2 sm:p-4 max-w-full">
      {isAuthenticated && (
        <>
          {showBinary && (
            <div className="binary mb-4 opacity-0 animate-fade-in overflow-hidden" style={{ animationFillMode: 'forwards' }}>
              <div className="break-all text-xs sm:text-sm">
                {generateBinary(200)}
              </div>
            </div>
          )}
          
          {showPanda && (
            <div className="panda-container mb-4 opacity-0 animate-fade-in overflow-x-auto" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <pre className="panda text-xs whitespace-pre min-w-max">
                {generatePandaAscii()}
              </pre>
            </div>
          )}
          
          {showWelcome && (
            <div className="welcome mt-4 opacity-0 animate-fade-in w-full max-w-full overflow-hidden">
              <p className="">
                Welcome to my interactive terminal portfolio! Wondering what you can explore? S
                imply type 'help' to reveal a wealth of available commands. 
                Thank you for dropping by, adventurer!
              </p>
            </div>
          )}
          
          {showPrompt && (
            <div className="terminal-interactive mt-4 opacity-0 animate-fade-in max-w-full" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              {/* Command output history */}
              <div className="command-output mb-4 max-w-full overflow-hidden">
                {commandOutput}
              </div>
              
              {/* Active command prompt */}
              <div className="active-prompt flex items-center max-w-full">
                <span className="text-terminal-success mr-1 flex-shrink-0">guest@terminal:~$</span>
                <div className="relative flex-1 min-w-0">
                <input
                    ref={commandInputRef}
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none text-white"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                  />
                  <span className="absolute top-0 left-0 text-white pointer-events-none">{currentCommand}</span>
                  {!currentCommand && <span className="cursor absolute top-0 left-0"></span>}
                  {currentCommand && <span className="cursor absolute top-0" style={{ left: `${currentCommand.length}ch` }}></span>}
                </div>
              </div>
              
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TerminalContent;