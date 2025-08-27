import React, { useState, useEffect } from 'react';

const AboutMe: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowDetails(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="border border-white/20 rounded text-green-400 font-mono mt-2 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <p className="text-terminal-command">$ ls about</p>
          <p className="pl-4">
            whoami/ &nbsp; skills/ &nbsp; interests/ &nbsp; contact/
          </p>
        </div>

        {showDetails && (
          <div className="mt-6 space-y-6">

            {/* whoami */}
            <div>
              <p className="text-terminal-command">$ cat about/whoami</p>
              <p className="pl-4 text-white">
                Hi, I’m <span className="text-terminal-success">[Your Name]</span> — a frontend dev and blockchain enthusiast. I craft beautiful UIs, experiment with token logic, and love blending art with code.
              </p>
            </div>

            {/* skills */}
            <div>
              <p className="text-terminal-command">$ cat about/skills</p>
              <ul className="pl-4 text-white list-disc">
                <li>React, Next.js, Tailwind CSS</li>
                <li>Web3: ethers.js, Web3Modal, Solidity</li>
                <li>Node.js, Express, Firebase</li>
                <li>Design: Figma, Framer, motion effects</li>
              </ul>
            </div>

            {/* interests */}
            <div>
              <p className="text-terminal-command">$ cat about/interests</p>
              <p className="pl-4 text-white">
                Sci-fi art, terminal UIs, dark mode everything, digital storytelling, decentralization, pixel-perfect UI.
              </p>
            </div>

            {/* contact */}
            <div>
              <p className="text-terminal-command">$ cat about/contact</p>
              <p className="pl-4 text-white">
                Email: <a href="mailto:you@example.com" className="underline text-terminal-success">you@example.com</a><br />
                GitHub: <a href="https://github.com/yourhandle" target="_blank" className="underline text-terminal-success">github.com/yourhandle</a><br />
                X: <a href="https://x.com/yourhandle" target="_blank" className="underline text-terminal-success">@yourhandle</a>
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AboutMe;
