import React, { useEffect, useState, useRef } from 'react';

// Enhanced TerminalBorder with realistic cracks
interface TerminalBorderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const TerminalBorder: React.FC<TerminalBorderProps> = ({ children, isLoading }) => {
  const [cracks, setCracks] = useState<Array<{ 
    x: number; 
    y: number; 
    length: number; 
    angle: number; 
    branches: Array<{ angle: number; length: number }>;
  }>>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      // Generate realistic crack patterns
      const newCracks = Array.from({ length: 3 }, (_, i) => {
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        const mainLength = 50 + Math.random() * 100;
        const angle = Math.random() * 360;
        
        // Generate branches for more realistic cracks
        const branches = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => ({
          angle: angle + (Math.random() - 0.5) * 90,
          length: mainLength * (0.3 + Math.random() * 0.4)
        }));

        return { x, y, length: mainLength, angle, branches };
      });
      setCracks(newCracks);
    }
  }, [isLoading]);

  // Enhanced auto-scrolling
  useEffect(() => {
    if (contentRef.current) {
      const scrollElement = contentRef.current;
      
      const scrollToBottom = () => {
        requestAnimationFrame(() => {
          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        });
      };

      scrollToBottom();

      const observer = new MutationObserver(() => {
        scrollToBottom();
      });

      observer.observe(scrollElement, {
        childList: true,
        subtree: true,
        characterData: true
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-6xl h-[90vh] border border-green-500/40 bg-black shadow-lg shadow-green-500/20">
        {/* Realistic crack overlay */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            opacity: isLoading ? 0 : 0.4,
            transition: 'opacity 2s ease-in-out'
          }}
        >
          {cracks.map((crack, index) => (
            <g key={index}>
              {/* Main crack line */}
              <line
                x1={`${crack.x}%`}
                y1={`${crack.y}%`}
                x2={`${crack.x + Math.cos(crack.angle * Math.PI / 180) * crack.length / 10}%`}
                y2={`${crack.y + Math.sin(crack.angle * Math.PI / 180) * crack.length / 10}%`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))',
                  animation: `crackGlow 3s ease-in-out infinite alternate`
                }}
              />
              {/* Crack branches */}
              {crack.branches.map((branch, branchIndex) => (
                <line
                  key={branchIndex}
                  x1={`${crack.x + Math.cos(crack.angle * Math.PI / 180) * crack.length / 20}%`}
                  y1={`${crack.y + Math.sin(crack.angle * Math.PI / 180) * crack.length / 20}%`}
                  x2={`${crack.x + Math.cos(branch.angle * Math.PI / 180) * branch.length / 15}%`}
                  y2={`${crack.y + Math.sin(branch.angle * Math.PI / 180) * branch.length / 15}%`}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          ))}
        </svg>

        <div
          ref={contentRef}
          className="absolute inset-[2px] bg-black overflow-auto scroll-smooth p-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#22c55e transparent'
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes crackGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
        
        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background-color: #22c55e;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TerminalBorder;