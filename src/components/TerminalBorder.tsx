import React, { useEffect, useRef } from "react";

interface TerminalBorderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const TerminalBorder: React.FC<TerminalBorderProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll only while the user is already near the bottom (don't fight manual scroll)
  useEffect(() => {
    const scrollElement = contentRef.current;
    if (!scrollElement) return;

    const isNearBottom = () =>
      scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 80;

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    };

    scrollToBottom();

    const observer = new MutationObserver(() => {
      if (isNearBottom()) scrollToBottom();
    });

    observer.observe(scrollElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-black p-2 md:p-3">
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden border border-green-500/40 bg-black shadow-lg shadow-green-500/20">
        <div
          ref={contentRef}
          className="terminal-scroll relative z-0 min-h-0 flex-1 overflow-y-scroll overflow-x-hidden bg-black p-3 text-[13px] leading-relaxed sm:text-sm md:p-5"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#22c55e transparent",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        .terminal-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .terminal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .terminal-scroll::-webkit-scrollbar-thumb {
          background-color: #22c55e;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TerminalBorder;
