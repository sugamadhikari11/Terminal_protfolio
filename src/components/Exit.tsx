import React from 'react';

const Exit: React.FC = () => {
  return (
    <div className="mt-4 p-4 border border-white/20 rounded">
      <div className="text-lg font-bold mb-4 text-terminal-success">👋 Thanks for Visiting!</div>
      
      <div className="space-y-3 text-sm">
        <p className="text-white/80">
          You tried to exit, but there's no escape from this terminal! 😄
        </p>
        
        <div className="bg-white/5 p-3 rounded">
          <div className="text-terminal-command mb-2">Instead, why not:</div>
          <div className="text-xs text-white/70 space-y-1 ml-3">
            <div>• Type 'help' to explore more commands</div>
            <div>• Check out my 'projects' to see what I've built</div>
            <div>• Use 'contact' to get in touch</div>
            <div>• Try 'clear' to clean up the terminal</div>
          </div>
        </div>
        
        <p className="text-xs text-white/60">
          🎯 Remember: In the world of development, there's always more to explore!
        </p>
      </div>
    </div>
  );
};

export default Exit;