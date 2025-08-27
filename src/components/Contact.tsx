// Contact.tsx
import React from 'react';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      method: "Email",
      value: "your.email@example.com",
      icon: "📧",
      action: "mailto:your.email@example.com"
    },
    {
      method: "LinkedIn",
      value: "/in/yourprofile",
      icon: "💼",
      action: "https://linkedin.com/in/yourprofile"
    },
    {
      method: "GitHub",
      value: "/yourusername",
      icon: "🐙",
      action: "https://github.com/yourusername"
    },
    {
      method: "Portfolio",
      value: "yourportfolio.com",
      icon: "🌐",
      action: "https://yourportfolio.com"
    }
  ];

  return (
    <div className="mt-4 p-4 border border-white/20 rounded">
      <div className="text-lg font-bold mb-4 text-terminal-success">📞 Let's Connect!</div>
      
      <div className="mb-4">
        <p className="text-sm text-white/80 mb-3">
          I'm always excited to discuss new opportunities, collaborate on interesting projects, 
          or just chat about technology and development.
        </p>
      </div>

      <div className="space-y-3">
        {contactMethods.map((contact, idx) => (
          <div key={idx} className="contact-item flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors">
            <span className="text-lg">{contact.icon}</span>
            <div className="flex-1">
              <div className="text-terminal-command font-bold text-sm">{contact.method}</div>
              <div className="text-xs text-white/70">{contact.value}</div>
            </div>
            <div className="text-xs text-terminal-success">
              [Click to open]
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-terminal-success/10 border border-terminal-success/20 rounded">
        <div className="text-sm text-terminal-success mb-2">💡 Quick Response Promise:</div>
        <div className="text-xs text-white/70">
          I typically respond to emails within 24 hours. For urgent matters, 
          LinkedIn messages tend to get the fastest response!
        </div>
      </div>

      <div className="mt-4 text-xs text-white/60">
        🤝 Open to: Full-time roles, freelance projects, and interesting collaborations
      </div>
    </div>
  );
};

export default Contact;