import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedSections, setDisplayedSections] = useState<number[]>([]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progressive loading of sections
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSections([0, 1, 2, 3]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const contactInfo = [
    {
      label: "Email",
      value: "sugam.19217113@gmail.com",
      link: "mailto:sugam.19217113@gmail.com",
    },
    {
      label: "GitHub",
      value: "github.com/sugamadhikari11",
      link: "https://github.com/sugamadhikari11",
    },
    {
      label: "LinkedIn", 
      value: "linkedin.com/in/sugamadhikari",
      link: "https://www.linkedin.com/in/sugamadhikari/",
    },
    {
      label: "Location",
      value: "Kathmandu, Nepal",
      link: null,
    },
    {
      label: "Status",
      value: "Available for collaboration",
      link: null,
    }
  ];

  const sections = [
    {
      command: "echo $INTRO_MESSAGE",
      content: "I'm always excited to discuss new opportunities, collaborate on interesting projects, or just chat about technology and development."
    },
    {
      command: "cat ~/.contact_info",
      content: contactInfo
    },
    {
      command: "systemctl status response_time",
      content: {
        type: "status",
        message: "Quick Response Promise: I typically respond to emails within 24 hours. For urgent matters, LinkedIn messages tend to get the fastest response!"
      }
    },
    {
      command: "grep -i 'open to' ~/availability.txt",
      content: "Open to: Full-time roles, freelance projects, and interesting collaborations"
    }
  ];

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-6">
      {/* Terminal header */}
      <div className="mb-2">
        <div className="text-green-400">
          {`┌─────────────────────────────────────────────────────────────┐
│                       LET'S CONNECT!                        │
└─────────────────────────────────────────────────────────────┘`}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          displayedSections.includes(idx) && (
            <div key={idx} className="space-y-2">
              {/* Command prompt */}
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                <span className="text-white">{section.command}</span>
              </div>
              
              {/* Section content */}
              <div className="ml-4 border-l-2 border-green-400/30 pl-4">
                {typeof section.content === 'string' ? (
                  <div className="text-gray-300">{section.content}</div>
                ) : Array.isArray(section.content) ? (
                  <div className="space-y-2">
                    {section.content.map((contact, contactIdx) => (
                      <div key={contactIdx} className="flex items-center gap-3 hover:bg-gray-900/30 p-2 rounded transition-colors">
                        <div className="flex-1">
                          <span className="text-yellow-400">{contact.label}</span>
                          <span className="text-gray-400 mx-2">::</span>
                          {contact.link ? (
                            <a 
                              href={contact.link} 
                              target={contact.link.startsWith('mailto:') ? '_self' : '_blank'}
                              rel="noopener noreferrer"
                              className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted"
                            >
                              {contact.value}
                            </a>
                          ) : (
                            <span className="text-gray-200">{contact.value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.content.type === 'status' ? (
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-300 font-bold">ACTIVE</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                       {section.content.message}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300">
                    {typeof section.content === 'object' ? JSON.stringify(section.content) : section.content}
                  </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-green-400/30">
        <div className="space-y-2">
          <div className="ml-4 text-gray-300 p-3">
            <div className="text-cyan-300 font-bold mb-2">Ready to Collaborate?</div>
            <div className="space-y-1 text-sm">
              <div>→ Choose any contact method above</div>
              <div>→ Let's discuss your project or opportunity</div>
              <div>→ I'm excited to hear from you!</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;