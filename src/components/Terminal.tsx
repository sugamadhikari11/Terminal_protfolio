"use client";

import React, { useState, useEffect, useCallback } from "react";
import TerminalBorder from "./TerminalBorder";
import SessionInfo from "../hooks/sessionInfo";
import TerminalContent from "./TerminalContent";
import { useTypewriter } from "../hooks/typeWriter";
import { sleep } from "../utils/terminalUtils";

type TerminalProps = {
  /** Flip the cube into the visual GUI experience */
  onOpenGui?: () => void;
};

const Terminal: React.FC<TerminalProps> = ({ onOpenGui }) => {
  const [connecting, setConnecting] = useState(true);
  const [showSSH, setShowSSH] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { displayText: sshText } = useTypewriter(
    showSSH ? "ssh guest@terminal.portfolio" : "",
    40,
    0
  );

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      await sleep(400);
      if (cancelled) return;
      setShowSSH(true);
      await sleep(1000);
      if (cancelled) return;
      setConnecting(false);
    };
    void initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthentication = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <TerminalBorder isLoading={connecting}>
      <div className="font-mono text-sm text-green-400">
        <div className="mb-4">
          <div className="mb-2 flex items-center text-yellow-400">
            <span className="mr-2">[{connecting ? "●" : "✓"}]</span>
            <span>Establishing secure connection...</span>
            {connecting && (
              <span className="ml-2 animate-pulse">⣾⣽⣻⢿⡿⣟⣯⣷</span>
            )}
          </div>
          {connecting && (
            <div className="h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 animate-pulse rounded-full bg-green-500"
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>

        {showSSH && (
          <div className="mb-2">
            <span className="text-white">user@localhost:~$ </span>
            <span className="text-cyan-400">{sshText}</span>
            <span className="animate-pulse text-green-400">|</span>
          </div>
        )}

        {!connecting && <SessionInfo onComplete={handleAuthentication} />}
        <TerminalContent
          isAuthenticated={isAuthenticated}
          onOpenGui={onOpenGui}
        />
      </div>
    </TerminalBorder>
  );
};

export default Terminal;
