"use client";

import React, { useState, useEffect, useRef } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface SessionInfoProps {
  onComplete: () => void;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ onComplete }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [stamp, setStamp] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await sleep(300);
      if (cancelled) return;
      setStamp(new Date().toLocaleString());
      setShowInfo(true);
      await sleep(600);
      if (cancelled || doneRef.current) return;
      doneRef.current = true;
      onComplete();
    };
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showInfo) return null;

  return (
    <div className="my-4 text-sm text-gray-400">
      <div>Session started: {stamp}</div>
      <div>Terminal ready for commands...</div>
    </div>
  );
};

export default SessionInfo;
