// Theme.tsx
import React, { useState } from 'react';

const Theme: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  
  const themes = [
    { name: 'default', display: 'Default Green', color: '#00ff00' },
    { name: 'matrix', display: 'Matrix Green', color: '#00ff41' },
    { name: 'hacker', display: 'Hacker Blue', color: '#00ffff' },
    { name: 'retro', display: 'Retro Amber', color: '#ffb000' },
    { name: 'cyberpunk', display: 'Cyberpunk Pink', color: '#ff00ff' },
  ];

  return (
    <div className="mt-4 p-4 border border-white/20 rounded">
      <div className="text-lg font-bold mb-4 text-terminal-success">🎨 Terminal Themes</div>
      
      <div className="mb-4">
        <p className="text-sm text-white/80 mb-3">
          Choose your preferred terminal color scheme:
        </p>
      </div>

      <div className="space-y-2">
        {themes.map((theme) => (
          <div 
            key={theme.name}
            onClick={() => setCurrentTheme(theme.name)}
            className={`theme-option flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
              currentTheme === theme.name ? 'bg-white/20 border border-white/30' : 'hover:bg-white/10'
            }`}
          >
            <div 
              className="w-4 h-4 rounded-full border border-white/30"
              style={{ backgroundColor: theme.color }}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-bold">{theme.display}</div>
            </div>
            {currentTheme === theme.name && (
              <div className="text-xs text-terminal-success">✓ Active</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded">
        <div className="text-sm text-yellow-400 mb-1">⚠️ Coming Soon:</div>
        <div className="text-xs text-white/70">
          Theme switching functionality is currently in development. 
          The visual preview shows what each theme will look like!
        </div>
      </div>
    </div>
  );
};

export default Theme;