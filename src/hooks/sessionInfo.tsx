import React, { useState, useEffect } from 'react';

// Utility functions
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Session Info Component
interface SessionInfoProps {
  onComplete: () => void;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ onComplete }) => {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      await sleep(400);
      setShowInfo(true);
      await sleep(800);
      onComplete();
    };

    initializeSession();
  }, [onComplete]);

  return (
    <div className="my-4">
      {showInfo && (
        <div className="opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
          <div className="text-gray-400 text-sm">
            Session started: {new Date().toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">
            Terminal ready for commands...
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default SessionInfo;