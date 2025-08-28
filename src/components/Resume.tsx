import React, { useState, useEffect } from 'react';

const Resume: React.FC = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedSections, setDisplayedSections] = useState<number[]>([]);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadPDF = async () => {
    setDownloading(true);
    
    try {
      // First check if the file exists and is accessible
      const response = await fetch('/resume.pdf');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Check if the blob has content
      if (blob.size === 0) {
        throw new Error('PDF file is empty');
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Sugam_Adhikari_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ PDF downloaded successfully (${blob.size} bytes)`);
    } catch (error) {
      console.error('❌ Download failed:', error);
      alert(`Download failed: ${error.message}\n\nPlease check:\n1. File exists at /public/resume.pdf\n2. File is not corrupted\n3. File has proper permissions`);
    }

    setTimeout(() => setDownloading(false), 1000);
  };

  const handleViewOnline = async () => {
    try {
      // Check if file exists before trying to open
      const response = await fetch('/resume.pdf', { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`File not accessible (status: ${response.status})`);
      }
      
      // Open the resume in a new tab
      window.open('/resume.pdf', '_blank');
      console.log('✅ PDF opened in new tab');
    } catch (error) {
      console.error('❌ View failed:', error);
      alert(`Cannot open PDF: ${error.message}\n\nPlease check:\n1. File exists at /public/resume.pdf\n2. File is not corrupted\n3. Browser can display PDFs`);
    }
  };

  const sections = [
    {
      command: "ls -la ~/documents/resume/",
      content: "resume.pdf    updated: Aug 2025    size: 2.3MB    status: ✅ CURRENT"
    },
    {
      command: "head -20 ~/documents/resume/highlights.md",
      content: [
        {
          title: "EXPERIENCE",
          items: [
            "Full-stack Developer (July 2025 - Present)",
            "Blockchain Developer Intern @ Clock b (March 2025 - June 2025)", 
            "Blockchain Trainee (Dec 2024 - Feb 2025)"
          ]
        },
        {
          title: "EDUCATION",
          items: [
            "BSc (Hons) in Data Science",
            "Birmingham City University via Sunway International College",
            "2023 - Present"
          ]
        },
        {
          title: "KEY ACHIEVEMENTS",
          items: [
            "2+ years development experience across multiple domains",
            "Specialized in Web3 and DeFi application development",
            "Experience with scalable e-commerce platform architecture",
            "Data science projects with real-world applications"
          ]
        }
      ]
    }
  ];

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-6">
      {/* Terminal header */}
      <div className="mb-6">
        <div className="text-green-400">
          {`┌─────────────────────────────────────────────────────────────┐
│                          RESUME                              │
└─────────────────────────────────────────────────────────────┘`}
        </div>
      </div>

      {/* Resume actions */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-cyan-400">$</span>
          <span className="text-white">./resume --help</span>
        </div>
        <div className="ml-4 border-l-2 border-green-400/30 pl-4 space-y-3">
          <div className="text-gray-300 mb-4">Available resume operations:</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-400">▸</span>
              <span 
                onClick={handleDownloadPDF}
                className="text-cyan-400 underline cursor-pointer hover:text-cyan-300 transition-colors select-none"
              >
                {downloading ? '[Downloading...]' : '[download-resume.pdf]'}
              </span>
              <span className="text-gray-500 text-xs">- Download PDF copy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">▸</span>
              <span 
                onClick={handleViewOnline}
                className="text-yellow-400 underline cursor-pointer hover:text-yellow-300 transition-colors select-none"
              >
                [view-online.pdf]
              </span>
              <span className="text-gray-500 text-xs">- Open in browser</span>
            </div>
          </div>
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
                  <div className="text-gray-300 bg-gray-900/30 p-2 rounded font-mono text-xs">
                    {section.content}
                  </div>
                ) : Array.isArray(section.content) ? (
                  <div className="space-y-4">
                    {section.content.map((category, catIdx) => (
                      <div key={catIdx}>
                        <div className="text-yellow-400 font-bold mb-2">{category.title}</div>
                        <div className="space-y-1">
                          {category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-2">
                              <span className="text-green-400">▸</span>
                              <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-300">{section.content}</div>
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
            <div className="text-cyan-300 font-bold mb-2">Professional Summary</div>
            <div className="space-y-1 text-sm">
              <div>→ Data Science student with 2+ years development experience</div>
              <div>→ Specialized in Web3, blockchain, and full-stack development</div>
              <div>→ Ready for new opportunities and collaborations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;