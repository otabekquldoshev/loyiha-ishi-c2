import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Zap } from "lucide-react";

interface ThreatNode {
  id: string;
  lat: number;
  lng: number;
  type: 'attack' | 'defense' | 'compromised';
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
}

interface Connection {
  from: number;
  to: number;
  type: 'attack' | 'data' | 'command';
}

const threatNodes: ThreatNode[] = [
  { id: 'NODE-001', lat: 40.7128, lng: -74.0060, type: 'defense', severity: 'low', label: 'NYC-HQ' },
  { id: 'NODE-002', lat: 51.5074, lng: -0.1278, type: 'compromised', severity: 'critical', label: 'LON-TARGET' },
  { id: 'NODE-003', lat: 35.6762, lng: 139.6503, type: 'attack', severity: 'high', label: 'TYO-THREAT' },
  { id: 'NODE-004', lat: -33.8688, lng: 151.2093, type: 'defense', severity: 'medium', label: 'SYD-NODE' },
  { id: 'NODE-005', lat: 55.7558, lng: 37.6173, type: 'attack', severity: 'critical', label: 'MOS-ATTACK' },
  { id: 'NODE-006', lat: 37.7749, lng: -122.4194, type: 'compromised', severity: 'high', label: 'SF-BREACH' },
  { id: 'NODE-007', lat: 1.3521, lng: 103.8198, type: 'defense', severity: 'low', label: 'SIN-SEC' },
  { id: 'NODE-008', lat: 25.2048, lng: 55.2708, type: 'attack', severity: 'medium', label: 'DXB-SCAN' },
];

const connections: Connection[] = [
  { from: 2, to: 1, type: 'attack' },
  { from: 4, to: 5, type: 'attack' },
  { from: 0, to: 3, type: 'command' },
  { from: 2, to: 5, type: 'data' },
  { from: 7, to: 6, type: 'attack' },
];

export function ThreatMap() {
  const [activeAttacks, setActiveAttacks] = useState<Set<number>>(new Set());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const newAttacks = new Set<number>();
      connections.forEach((_, idx) => {
        if (Math.random() > 0.5) newAttacks.add(idx);
      });
      setActiveAttacks(newAttacks);
      setTime(new Date());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latToY = (lat: number) => ((90 - lat) / 180) * 100;
  const lngToX = (lng: number) => ((lng + 180) / 360) * 100;

  const getNodeColor = (type: string, severity: string) => {
    if (type === 'attack') return 'var(--c2-crimson)';
    if (type === 'compromised') return '#FF6B00';
    return 'var(--c2-cyan)';
  };

  const getSeverityGlow = (severity: string) => {
    switch (severity) {
      case 'critical': return '0 0 20px var(--c2-crimson), 0 0 40px var(--c2-crimson-glow)';
      case 'high': return '0 0 15px #FF6B00';
      case 'medium': return '0 0 10px #FFA500';
      default: return '0 0 8px var(--c2-cyan)';
    }
  };

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--c2-darker-surface)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.1)',
      }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="threat-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--c2-cyan)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--c2-cyan)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="var(--c2-toxic)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--c2-crimson)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#threat-grid)" />
        </svg>
      </div>

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, idx) => {
          const from = threatNodes[conn.from];
          const to = threatNodes[conn.to];
          const x1 = lngToX(from.lng);
          const y1 = latToY(from.lat);
          const x2 = lngToX(to.lng);
          const y2 = latToY(to.lat);
          const isActive = activeAttacks.has(idx);

          return (
            <g key={idx}>
              <line
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={conn.type === 'attack' ? 'var(--c2-crimson)' : 'var(--c2-cyan)'}
                strokeWidth={isActive ? "2" : "1"}
                opacity={isActive ? "0.8" : "0.3"}
                strokeDasharray={conn.type === 'attack' ? "8 4" : "4 4"}
                className={isActive ? "animate-pulse" : ""}
              />
              {isActive && (
                <circle r="3" fill={conn.type === 'attack' ? 'var(--c2-crimson)' : 'var(--c2-cyan)'}>
                  <animateMotion
                    dur="2s"
                    repeatCount="1"
                    path={`M ${x1},${y1} L ${x2},${y2}`}
                    calcMode="linear"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Threat Nodes */}
      {threatNodes.map((node, idx) => {
        const x = lngToX(node.lng);
        const y = latToY(node.lat);

        return (
          <div
            key={node.id}
            className="absolute group cursor-pointer z-10"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pulsing Ring for Critical */}
            {node.severity === 'critical' && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: getNodeColor(node.type, node.severity),
                  opacity: 0.4,
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                }}
              />
            )}
            
            {/* Node Circle */}
            <div
              className="relative w-4 h-4 rounded-full transition-all duration-300 hover:scale-125"
              style={{
                backgroundColor: getNodeColor(node.type, node.severity),
                boxShadow: getSeverityGlow(node.severity),
                border: `2px solid ${getNodeColor(node.type, node.severity)}`,
              }}
            >
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {node.type === 'attack' ? (
                  <Zap className="w-2.5 h-2.5 text-white" />
                ) : node.type === 'compromised' ? (
                  <AlertTriangle className="w-2.5 h-2.5 text-white" />
                ) : (
                  <Shield className="w-2.5 h-2.5 text-white" />
                )}
              </div>
            </div>

            {/* Enhanced Tooltip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none backdrop-blur-md z-20"
              style={{
                backgroundColor: 'rgba(13, 17, 23, 0.95)',
                border: `1px solid ${getNodeColor(node.type, node.severity)}`,
                boxShadow: `0 0 20px ${getNodeColor(node.type, node.severity)}40`,
              }}
            >
              <div className="text-xs font-mono">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: getNodeColor(node.type, node.severity) }} className="font-bold">
                    {node.id}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold"
                    style={{
                      backgroundColor: `${getNodeColor(node.type, node.severity)}30`,
                      color: getNodeColor(node.type, node.severity),
                    }}
                  >
                    {node.severity}
                  </span>
                </div>
                <div className="text-gray-400">{node.label}</div>
                <div className="text-gray-500 text-[10px] mt-0.5 capitalize">{node.type}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Header with Stats */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div 
          className="px-4 py-2 rounded-lg font-mono text-xs backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: 'var(--c2-cyan)',
          }}
        >
          GLOBAL THREAT INTELLIGENCE MAP
        </div>
        <div 
          className="px-4 py-2 rounded-lg font-mono text-xs backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 75, 75, 0.3)',
            color: 'var(--c2-crimson)',
          }}
        >
          {time.toLocaleTimeString('en-US', { hour12: false })} UTC
        </div>
      </div>

      {/* Legend */}
      <div 
        className="absolute bottom-4 left-4 px-3 py-2 rounded-lg backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
        }}
      >
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--c2-cyan)' }} />
            <span className="text-gray-400">Defense</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6B00' }} />
            <span className="text-gray-400">Compromised</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--c2-crimson)' }} />
            <span className="text-gray-400">Attack</span>
          </div>
        </div>
      </div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="h-0.5 w-full absolute animate-scan"
          style={{ 
            background: 'linear-gradient(90deg, transparent, var(--c2-cyan), transparent)',
            boxShadow: '0 0 20px var(--c2-cyan)',
          }}
        />
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
