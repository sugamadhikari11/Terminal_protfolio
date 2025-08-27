import React from 'react';

const Skills: React.FC = () => {
  const skillCategories = {
    "Frontend": {
      skills: ["React", "TypeScript", "Vue.js", "HTML5", "CSS3", "Tailwind CSS", "SASS"],
      icon: "💻"
    },
    "Backend": {
      skills: ["Node.js", "Python", "Express.js", "FastAPI", "REST APIs", "GraphQL"],
      icon: "⚙️"
    },
    "Database": {
      skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Firebase"],
      icon: "🗄️"
    },
    "DevOps & Tools": {
      skills: ["Docker", "Git", "AWS", "CI/CD", "Linux", "Nginx"],
      icon: "🔧"
    },
    "Other": {
      skills: ["Socket.io", "Chart.js", "Stripe API", "JWT", "Testing", "Agile"],
      icon: "🌟"
    }
  };

  return (
    <div className="mt-4 p-4 border border-white/20 rounded">
      <div className="text-lg font-bold mb-4 text-terminal-success">🎯 Technical Skills</div>
      <div className="space-y-4">
        {Object.entries(skillCategories).map(([category, data]) => (
          <div key={category} className="skill-category">
            <h3 className="text-terminal-command font-bold mb-2 flex items-center gap-2">
              <span>{data.icon}</span>
              {category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ml-6">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="skill-item text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-white/5 rounded">
        <div className="text-sm text-terminal-success mb-1">⚡ Quick Stats:</div>
        <div className="text-xs text-white/70 space-y-1">
          <div>• 3+ years of full-stack development experience</div>
          <div>• 15+ projects completed</div>
          <div>• Always learning and adapting to new technologies</div>
        </div>
      </div>
    </div>
  );
};

export default Skills;