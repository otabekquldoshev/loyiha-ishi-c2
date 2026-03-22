import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Zap, Globe, Clock } from "lucide-react";

interface ThreatEvent {
  id: string;
  time: string;
  type: 'intrusion' | 'malware' | 'ddos' | 'breach' | 'scan';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  description: string;
}

const threatTypes = {
  intrusion: { icon: AlertTriangle, label: 'Intrusion Attempt' },
  malware: { icon: Zap, label: 'Malware Detected' },
  ddos: { icon: Globe, label: 'DDoS Attack' },
  breach: { icon: Shield, label: 'Data Breach' },
  scan: { icon: Clock, label: 'Port Scan' },
};

const mockThreats: ThreatEvent[] = [
  { id: 'THR-001', time: '14:25:33', type: 'intrusion', severity: 'critical', source: '45.142.212.61', target: 'TGT-4F2A', description: 'Multiple failed SSH login attempts detected' },
  { id: 'THR-002', time: '14:24:12', type: 'malware', severity: 'high', source: 'Unknown', target: 'TGT-8B91', description: 'Trojan.GenericKD.65432187 quarantined' },
  { id: 'THR-003', time: '14:22:45', type: 'ddos', severity: 'critical', source: '192.168.1.0/24', target: 'Web Server', description: 'Distributed denial of service attack - 50K req/s' },
  { id: 'THR-004', time: '14:20:18', type: 'breach', severity: 'high', source: 'Internal', target: 'DB Primary', description: 'Unauthorized data access attempt blocked' },
  { id: 'THR-005', time: '14:18:56', type: 'scan', severity: 'medium', source: '91.203.45.12', target: 'Firewall-01', description: 'Network reconnaissance detected on ports 22-443' },
];

export function ThreatFeed() {
  const [threats, setThreats] = useState(mockThreats);
  const [newThreat, setNewThreat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewThreat(true);
      setTimeout(() => setNewThreat(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--c2-crimson)';
      case 'high': return '#FF6B00';
      case 'medium': return '#FFA500';
      case 'low': return '#FFD700';
      default: return 'var(--c2-cyan)';
    }
  };

  return (
    <div 
      className="rounded-lg backdrop-blur-sm overflow-hidden h-full flex flex-col"
      style={{
        backgroundColor: 'rgba(22, 27, 34, 0.5)',
        border: '1px solid rgba(255, 75, 75, 0.2)',
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(255, 75, 75, 0.1)' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color: 'var(--c2-crimson)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--c2-crimson)' }}>
            Live Threat Feed
          </h3>
        </div>
        <div 
          className={`px-2 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 ${newThreat ? 'animate-pulse' : ''}`}
          style={{
            backgroundColor: 'rgba(255, 75, 75, 0.2)',
            border: '1px solid var(--c2-crimson)',
            color: 'var(--c2-crimson)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          LIVE
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-2 border-b grid grid-cols-4 gap-2" style={{ borderColor: 'rgba(255, 75, 75, 0.05)' }}>
        {[
          { label: 'Critical', value: 2, color: 'var(--c2-crimson)' },
          { label: 'High', value: 2, color: '#FF6B00' },
          { label: 'Medium', value: 1, color: '#FFA500' },
          { label: 'Total', value: 5, color: 'var(--c2-cyan)' },
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-[10px] text-gray-400 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Threat List */}
      <div className="flex-1 overflow-y-auto">
        {threats.map((threat, idx) => {
          const ThreatIcon = threatTypes[threat.type].icon;
          return (
            <div
              key={threat.id}
              className="px-4 py-3 border-b hover:bg-red-500/5 transition-all"
              style={{ 
                borderColor: 'rgba(255, 75, 75, 0.05)',
                animation: idx === 0 && newThreat ? 'slideIn 0.5s ease-out' : 'none',
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon and Severity */}
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{
                      backgroundColor: `${getSeverityColor(threat.severity)}20`,
                      border: `1px solid ${getSeverityColor(threat.severity)}40`,
                    }}
                  >
                    <ThreatIcon 
                      className="w-3.5 h-3.5"
                      style={{ color: getSeverityColor(threat.severity) }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${getSeverityColor(threat.severity)}20`,
                          color: getSeverityColor(threat.severity),
                          border: `1px solid ${getSeverityColor(threat.severity)}40`,
                        }}
                      >
                        {threat.severity}
                      </span>
                      <span className="text-xs text-gray-400">{threatTypes[threat.type].label}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{threat.time}</span>
                  </div>

                  <div className="text-sm text-gray-200 mb-1.5">
                    {threat.description}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500">Source:</span>
                      <span className="font-mono" style={{ color: 'var(--c2-crimson)' }}>
                        {threat.source}
                      </span>
                    </span>
                    <span className="text-gray-600">→</span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500">Target:</span>
                      <span className="font-mono" style={{ color: 'var(--c2-cyan)' }}>
                        {threat.target}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
