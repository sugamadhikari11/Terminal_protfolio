import React, { useEffect, useState, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface TerminalBorderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const TerminalBorder: React.FC<TerminalBorderProps> = ({ children, isLoading }) => {
  const [cracks, setCracks] = useState<Array<{ x: number; y: number; size: number; angle: number }>>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isLoading) {
      // Generate random cracks when loading completes
      const newCracks = Array.from({ length: 5 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 20,
        angle: Math.random() * 360
      }));
      
      setCracks(newCracks);
    }
  }, [isLoading]);

  // Enhanced auto-scrolling effect with MutationObserver
  useEffect(() => {
    if (contentRef.current) {
      const scrollElement = contentRef.current;
      
      // Initial scroll to bottom
      const scrollToBottom = () => {
        requestAnimationFrame(() => {
          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        });
      };
      
      scrollToBottom();
      
      // Use MutationObserver to detect content changes
      const observer = new MutationObserver(() => {
        scrollToBottom();
      });
      
      // Observe the content element for any changes to its children or subtree
      observer.observe(scrollElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-8">
      <div className="relative w-full max-w-5xl h-[85vh] border border-white/40 bg-black">
        {cracks.map((crack, index) => (
          <div
            key={index}
            className="crack"
            style={{
              top: `${crack.y}%`,
              left: `${crack.x}%`,
              width: `${crack.size}%`,
              height: `${crack.size}%`,
              transform: `rotate(${crack.angle}deg)`,
              opacity: isLoading ? 0 : 0.6,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}
        <div 
          ref={contentRef}
          className="absolute inset-[2px] bg-black overflow-auto scroll-smooth"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TerminalBorder;
