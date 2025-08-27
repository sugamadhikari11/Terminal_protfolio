// Resume.tsx
import React from 'react';

const Resume: React.FC = () => {
  return (
    <div className="mt-4 p-4 border border-white/20 rounded">
      <div className="text-lg font-bold mb-4 text-terminal-success">📄 Resume</div>
      
      <div className="space-y-4">
        <div className="resume-actions flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-terminal-success/20 border border-terminal-success text-terminal-success rounded hover:bg-terminal-success/30 transition-colors">
            <span>📥</span>
            Download PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors">
            <span>👁️</span>
            View Online
          </button>
        </div>

        <div className="resume-preview bg-white/5 p-4 rounded">
          <div className="text-sm font-bold mb-3">📋 Resume Highlights:</div>
          
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-terminal-command font-bold">Experience</div>
              <div className="text-xs text-white/70 ml-3">
                • Senior Full-Stack Developer (2022-Present)<br/>
                • Frontend Developer (2021-2022)<br/>
                • Junior Developer (2020-2021)
              </div>
            </div>
            
            <div>
              <div className="text-terminal-command font-bold">Education</div>
              <div className="text-xs text-white/70 ml-3">
                • Bachelor's in Computer Science<br/>
                • Relevant certifications in React, Node.js
              </div>
            </div>
            
            <div>
              <div className="text-terminal-command font-bold">Key Achievements</div>
              <div className="text-xs text-white/70 ml-3">
                • Led development of 5+ major projects<br/>
                • Reduced application load time by 40%<br/>
                • Mentored 3 junior developers
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/60">
          📧 Updated monthly | Last updated: January 2025
        </div>
      </div>
    </div>
  );
};

export default Resume;
