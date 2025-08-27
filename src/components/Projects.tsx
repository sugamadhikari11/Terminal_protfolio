import React from 'react';

const Projects: React.FC = () => {
  const projects = [
    {
      name: "Interactive Terminal Portfolio",
      description: "A React-based terminal interface showcasing my work with ASCII art and command-line interactions.",
      tech: ["React", "TypeScript", "Tailwind CSS"],
      status: "Active"
    },
    {
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with modern UI and robust backend architecture.",
      tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      status: "Completed"
    },
    {
      name: "Task Management App",
      description: "Collaborative project management tool with real-time updates and team collaboration features.",
      tech: ["React", "Express.js", "MongoDB", "Socket.io"],
      status: "In Progress"
    },
    {
      name: "Weather Analytics Dashboard",
      description: "Data visualization dashboard for weather patterns with interactive charts and forecasting.",
      tech: ["Vue.js", "Python", "FastAPI", "Chart.js"],
      status: "Completed"
    }
  ];

  return (
    <div className="mt-4 p-4 border border-white/20 rounded">
      <div className="text-lg font-bold mb-4 text-terminal-success">🚀 My Projects</div>
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div key={idx} className="project-item p-3 border border-white/10 rounded">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-terminal-command font-bold">{project.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                project.status === 'Completed' ? 'bg-green-600/20 text-green-400' :
                project.status === 'In Progress' ? 'bg-yellow-600/20 text-yellow-400' :
                'bg-blue-600/20 text-blue-400'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-white/80 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, techIdx) => (
                <span key={techIdx} className="text-xs bg-white/10 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-white/60">
        💡 Type 'contact' to get in touch about any of these projects!
      </div>
    </div>
  );
};

export default Projects;