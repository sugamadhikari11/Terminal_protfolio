import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { sleep, generateBinary, generatePandaAscii, terminalCommands, getCommandDescription } from '../utils/terminalUtils';
import { useTypewriter } from '../hooks/typeWriter';
import { Projects, Skills, Contact, Resume, Theme, AboutMe, Exit } from './index';

// Enhanced Terminal Content
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
  const [isProcessing, setIsProcessing] = useState(false);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { displayText: welcomeText } = useTypewriter(
    "Welcome to my interactive terminal portfolio! Type 'help' to see available commands. Happy exploring, fellow developer!",
    30,
    showWelcome ? 0 : 0
  );

  // Function to focus input
  const focusInput = () => {
    if (commandInputRef.current && !isProcessing && showPrompt) {
      commandInputRef.current.focus();
    }
  };

  // Focus input whenever prompt is shown and not processing
  useEffect(() => {
    focusInput();
  }, [showPrompt, isProcessing]);

  // Handle clicks and typing like Linux terminal with proper text selection
  useEffect(() => {
    const handleTerminalClick = (e: MouseEvent) => {
      // Don't interfere with clicks on buttons, links, or interactive elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.tagName === 'INPUT' ||
          target.closest('button, a, input, textarea')) {
        return;
      }

      // Only handle clicks within the terminal area
      if (terminalRef.current?.contains(target)) {
        // Small delay to check if this was a text selection action
        setTimeout(() => {
          // If user has selected text, don't focus input
          if (window.getSelection()?.toString().length) {
            return;
          }
          // Otherwise focus input like Linux terminal
          focusInput();
        }, 10);
      }
    };

    // Handle global keydown - capture typing like Linux terminal
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // If input is not focused and we're not processing, focus it for typing
      if (document.activeElement !== commandInputRef.current && 
          !isProcessing && 
          showPrompt) {
        
        // Don't interfere with shortcuts or if user is typing in other inputs
        if (e.target instanceof HTMLInputElement || 
            e.target instanceof HTMLTextAreaElement ||
            e.ctrlKey || 
            e.metaKey || 
            e.altKey) {
          return;
        }
        
        // For Linux terminal behavior: focus on any printable character or common keys
        if (e.key.length === 1 || 
            ['Enter', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          focusInput();
        }
      }
    };

    // Handle mousedown to detect start of selection
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't interfere with interactive elements
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.tagName === 'INPUT' ||
          target.closest('button, a, input, textarea')) {
        return;
      }
      // Clear any existing selection to allow new selection to start
      if (terminalRef.current?.contains(target)) {
        // This mousedown might start a selection, so don't focus yet
      }
    };

    if (showPrompt) {
      document.addEventListener('click', handleTerminalClick);
      document.addEventListener('keydown', handleGlobalKeyDown);
      document.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      document.removeEventListener('click', handleTerminalClick);
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [showPrompt, isProcessing]);

  useEffect(() => {
    const loadResources = async () => {
      if (!isAuthenticated) return;
      
      setShowBinary(true);
      await sleep(400);
      
      setShowPanda(true);
      await sleep(800);
      
      setShowWelcome(true);
      await sleep(1200);
      
      setShowPrompt(true);
    };
    
    if (isAuthenticated) {
      loadResources();
    }
  }, [isAuthenticated]);

  const simulateProcessing = async () => {
    setIsProcessing(true);
    await sleep(50 + Math.random() * 200); // Random processing delay
    setIsProcessing(false);
  };

  const handleCommand = async () => {
    if (!currentCommand.trim() || isProcessing) return;
    
    await simulateProcessing();
    
    setCommandHistory(prev => [...prev, currentCommand]);
    setHistoryIndex(-1);
    
    const cmd = currentCommand.trim().toLowerCase();
    let output: JSX.Element;
    
    // Handle your existing page components
    if (cmd === 'projects') {
      output = (
          <Projects />
      );
    } else if (cmd === 'skills') {
      output = (
        <Skills />
      );
    } else if (cmd === 'contact') {
      output = (
        <Contact />
      );
    } else if (cmd === 'resume') {
      output = (
        <Resume />
      );
    } else if (cmd === 'about') {
      output = (
          <AboutMe />
      );
    } else if (cmd === 'exit') {
      output = (
        <Exit />
      );
    } else {
      // Default command map for built-in terminal commands
      const commandMap: { [key: string]: () => JSX.Element } = {
        help: () => (
          <div className="mt-2 p-4 rounded bg-black/50">
            <div className="text-green-400 font-bold mb-2">Available Commands:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {terminalCommands.map((cmd, idx) => (
                <div key={idx} className="flex">
                  <span className="text-cyan-400 font-mono w-16">{cmd}</span>
                  <span className="text-gray-300 text-sm ml-2"> - {getCommandDescription(cmd)}</span>
                </div>
              ))}
            </div>
          </div>
        ),
        clear: () => {
          setCommandOutput([]);
          return <div></div>;
        },
        whoami: () => <div className="mt-2 text-white">guest</div>,
        history: () => (
          <div className="mt-2 text-white">
            {commandHistory.map((cmd, idx) => (
              <div key={idx} className="font-mono">
                <span className="text-gray-400 mr-2">{idx + 1}</span>
                <span>{cmd}</span>
              </div>
            ))}
          </div>
        )
      };

      if (cmd === 'clear') {
        setCommandOutput([]);
        setCurrentCommand('');
        return;
      }
      
      output = commandMap[cmd] ? commandMap[cmd]() : (
        <div className="mt-2 text-red-400">
          bash: {cmd}: command not found
          <div className="text-gray-400 text-sm mt-1">
            Did you mean one of these? {terminalCommands.filter(c => c.includes(cmd.charAt(0))).slice(0, 3).join(', ')}
          </div>
        </div>
      );
    }
    
    setCommandOutput(prev => [
      ...prev, 
      <div key={prev.length} className="command-entry mt-2">
        <div className="flex items-center">
          <span className="text-green-400 mr-1">guest@terminal:~/portfolio$</span>
          <span className="text-white">{currentCommand}</span>
        </div>
        {output}
      </div>
    ]);
    
    setCurrentCommand('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = terminalCommands.filter(cmd => cmd.startsWith(currentCommand.toLowerCase()));
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      }
    }
  };

  return (
    <div ref={terminalRef} className="text-white font-mono text-sm select-text">
      {isAuthenticated && (
        <>
          {showBinary && (
            <div className="mb-4 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
              <div className="text-green-500 text-xs break-all select-text">
                {generateBinary(150)}
              </div>
            </div>
          )}
          
          {showPanda && (
            <div className="mb-4 opacity-0 animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <pre className="text-green-400 text-xs overflow-x-auto select-text">
                {generatePandaAscii()}
              </pre>
            </div>
          )}
          
          {showWelcome && (
            <div className="mb-4 p-4 border border-green-500/20 rounded bg-black/30 opacity-0 animate-fadeIn" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <div className="text-cyan-400 select-text">
                {welcomeText}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          )}
          
          {showPrompt && (
            <div className="opacity-0 animate-fadeIn" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
              <div className="mb-4 select-text">
                {commandOutput}
              </div>
              
              <div className="flex items-center">
                <span className="text-green-400 mr-2 select-none">guest@terminal:~/portfolio$</span>
                <div className="flex-1 relative">
                  <input
                    ref={commandInputRef}
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none text-white font-mono caret-green-500"
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isProcessing}
                  />
                  {isProcessing && (
                    <span className="absolute right-0 top-0 text-yellow-400">
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        
        input:focus {
          caret-color: #22c55e;
        }
        
        input {
          caret-color: #22c55e;
        }
        
        /* Allow text selection in terminal content */
        .select-text {
          user-select: text;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
        }
        
        /* Prevent selection of the prompt */
        .select-none {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </div>
  );
};

export default TerminalContent;