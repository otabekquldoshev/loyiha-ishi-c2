import { useState, useRef, useEffect } from "react";
import { Terminal, ChevronRight, Minimize2, Maximize2 } from "lucide-react";

interface LogEntry {
  type: 'command' | 'output' | 'success' | 'error';
  text: string;
  timestamp: string;
}

const initialLogs: LogEntry[] = [
  { type: 'output', text: '=== C2 NEXUS Terminal v2.4.1 ===', timestamp: '14:23:01' },
  { type: 'output', text: 'System initialized. Type "help" for available commands.', timestamp: '14:23:01' },
  { type: 'success', text: '[+] Connected to 247 active agents', timestamp: '14:23:02' },
];

const mockCommands: { [key: string]: string[] } = {
  help: [
    'Available commands:',
    '  agents list          - List all active agents',
    '  agent <id> info      - Get detailed agent information',
    '  task deploy <id>     - Deploy task to agent',
    '  exfil status         - Check exfiltration status',
    '  payload generate     - Generate new payload',
    '  scan <target>        - Perform vulnerability scan',
    '  exploit <cve>        - Launch exploit',
    '  persistence install  - Install persistence mechanism',
    '  lateral-move <id>    - Execute lateral movement',
    '  clear                - Clear terminal',
  ],
  'agents list': [
    'ID         IP              HOSTNAME           STATUS      LAST SEEN',
    '─────────  ─────────────── ────────────────── ──────────  ──────────',
    'TGT-4F2A   192.168.1.105   CORP-WS-01        ● ONLINE     2s ago',
    'TGT-8B91   10.0.0.42       MacBook-Pro       ● ONLINE     5s ago',
    'TGT-C3E7   172.16.0.88     ubuntu-server     ● ONLINE     12s ago',
    'TGT-D947   192.168.2.201   DEV-MACHINE       ⚠ CRITICAL   1m ago',
    'TGT-1A5C   10.10.10.15     web-server-01     ○ OFFLINE    3m ago',
  ],
  'exfil status': [
    '[+] Active exfiltration operations: 3',
    '[+] Total data transferred today: 2.4 GB',
    '[+] Average transfer speed: 12.8 MB/s',
    '─────────────────────────────────────────',
    'EXF-001  database_export.sql   78%  12.4 MB/s',
    'EXF-003  system_logs.zip       34%   8.9 MB/s',
    'EXF-004  email_archive.pst     12%  15.2 MB/s',
  ],
  'scan 192.168.1.105': [
    '[*] Initiating vulnerability scan...',
    '[*] Target: 192.168.1.105',
    '[*] Scanning ports: 1-65535',
    '[+] Open ports detected: 22, 80, 443, 3306, 8080',
    '[!] CVE-2024-1234 detected (CRITICAL) - Apache RCE',
    '[!] CVE-2024-5678 detected (HIGH) - MySQL SQLi',
    '[+] Scan complete. 2 vulnerabilities found.',
  ],
  clear: [],
};

export function C2Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    setLogs(prev => [...prev, { type: 'command', text: cmd, timestamp }]);

    if (cmd.toLowerCase() === 'clear') {
      setTimeout(() => {
        setLogs(initialLogs);
      }, 100);
      return;
    }

    const response = mockCommands[cmd.toLowerCase()] || [`Command not found: ${cmd}. Type "help" for available commands.`];
    
    setTimeout(() => {
      response.forEach((line, idx) => {
        setTimeout(() => {
          setLogs(prev => [...prev, { 
            type: response.length === 1 && line.includes('not found') ? 'error' : 'output', 
            text: line, 
            timestamp 
          }]);
        }, idx * 50);
      });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div 
      className="rounded-lg overflow-hidden backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: 'rgba(10, 14, 19, 0.9)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        height: isMinimized ? '48px' : '280px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Terminal Header */}
      <div 
        className="h-12 px-4 border-b flex items-center justify-between cursor-pointer select-none"
        style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" style={{ color: 'var(--c2-cyan)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--c2-cyan)' }}>
            TERMINAL
          </span>
          <span className="text-xs text-gray-500">// Direct Command Interface</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
          className="p-1 hover:bg-cyan-500/10 rounded transition-colors"
          style={{ color: 'var(--c2-cyan)' }}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <>
          <div 
            ref={terminalRef}
            className="h-[180px] overflow-y-auto px-4 py-2 text-sm"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--c2-cyan) transparent'
            }}
          >
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className="flex gap-3 mb-1 leading-relaxed"
              >
                <span className="text-gray-600 select-none text-xs">{log.timestamp}</span>
                {log.type === 'command' ? (
                  <div className="flex gap-2 items-center flex-1">
                    <ChevronRight className="w-3 h-3" style={{ color: 'var(--c2-cyan)' }} />
                    <span style={{ color: 'var(--c2-cyan)' }}>{log.text}</span>
                  </div>
                ) : (
                  <span 
                    className="flex-1"
                    style={{ 
                      color: log.type === 'error' ? 'var(--c2-crimson)' : 
                             log.type === 'success' ? 'var(--c2-toxic)' : 
                             '#c9d1d9'
                    }}
                  >
                    {log.text}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t px-4 py-2" style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--c2-cyan)' }} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--c2-cyan)' }}
                placeholder="Enter command..."
                autoFocus
              />
            </div>
          </form>
        </>
      )}

      <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: var(--c2-cyan);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: var(--c2-cyan);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}