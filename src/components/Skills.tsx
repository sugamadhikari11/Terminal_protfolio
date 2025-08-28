import React, { useState, useEffect } from 'react';

const Skills: React.FC = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedCategories, setDisplayedCategories] = useState<number[]>([]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progressive loading of categories
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedCategories([0, 1, 2, 3, 4, 5]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const skillCategories = [
    {
      name: "Frontend Development",
      command: "ls -la ~/skills/frontend/",
      skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Responsive Design"]
    },
    {
      name: "Blockchain & Web3",
      command: "find ~/blockchain/ -type f",
      skills: ["Solidity", "Web3.js", "ethers.js", "Smart Contracts", "DApps", "MetaMask Integration", "NFT Development"]
    },
    {
      name: "Data Science & Analytics",
      command: "python -m pip list | grep data",
      skills: ["Python", "R", "Power BI", "Data Visualization", "Statistical Analysis", "Machine Learning"]
    },
    {
      name: "Backend Development",
      command: "ps aux | grep server",
      skills: ["Node.js", "Express.js", "MongoDB", "RESTful APIs", "Database Design", "FireBase", "Django", "Authentication", "JWT"]
    },
    {
      name: "AI/ML & Automation",
      command: "conda list | grep ml",
      skills: ["Machine Learning", "AI Integration", "Data Processing", "Model Deployment"]
    },
    {
      name: "Tools & Technologies",
      command: "which --all",
      skills: ["Git", "VS Code", "PyCharm", "Figma", "Docker", "Linux", "Firebase", "Vercel", "Azure", "GitHub"]
    }
  ];

  const experienceHighlights = [
    "2+ years of development experience across multiple domains",
    "Specialized in Web3 and DeFi application development", 
    "Experience with multi-vendor e-commerce platform architecture",
    "Data science projects with business applications",
    "Continuous learner adapting to emerging technologies"
  ];

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-6 min-h-screen">
      {/* Terminal header */}
      <div className="mb-6">
        <div className="text-green-400">
          {`┌─────────────────────────────────────────────────────────────┐
│                      TECHNICAL SKILLS                       │
└─────────────────────────────────────────────────────────────┘`}
        </div>
      </div>

      {/* Overview */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-cyan-400">$</span>
          <span className="text-white">echo $DEVELOPER_PROFILE</span>
        </div>
        <div className="ml-4 text-gray-300 border-l-2 border-green-400/30 pl-4">
          Full-stack developer with expertise spanning frontend, blockchain, data science, and AI/ML technologies.
        </div>
      </div>

      {/* Skill Categories */}
      <div className="space-y-6">
        {skillCategories.map((category, idx) => (
          displayedCategories.includes(idx) && (
            <div key={idx} className="space-y-2">
              {/* Command prompt */}
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                <span className="text-white">{category.command}</span>
                <span className="text-gray-500"># {category.name}</span>
              </div>
              
              {/* Skills grid */}
              <div className="ml-4 border-l-2 border-green-400/30 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                  {category.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="flex items-center gap-2">
                      <span className="text-yellow-400">├─</span>
                      <span className="text-cyan-300 px-2 py-0.5 rounded text-xs transition-colors">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Experience Summary */}
      <div className="mt-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <span className="text-white">cat ~/experience/highlights.txt</span>
        </div>
        <div className="ml-4 border-l-2 border-green-400/30 pl-4 space-y-1">
          {experienceHighlights.map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-yellow-400">▸</span>
              <span className="text-gray-300">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-green-400/30">
        <div className="space-y-2">
          <div className="ml-4 text-gray-300 p-3">
            <div className="text-cyan-300 font-bold mb-2">Continuous Learning</div>
            <div className="space-y-1">
              <div>→ Always expanding skillset and staying updated with latest technologies</div>
              <div>→ Following best practices and industry standards</div>
              <div>→ Open to learning new frameworks and tools</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <span className="text-gray-400">sudo apt update && sudo apt upgrade # Always learning!</span>
        </div>
      </div>


    </div>
  );
};

export default Skills;