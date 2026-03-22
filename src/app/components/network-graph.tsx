import { useEffect, useState } from "react";
import { Server, Shield, AlertTriangle, Database } from "lucide-react";

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  type: 'server' | 'firewall' | 'database' | 'threat';
  label: string;
  status: 'secure' | 'warning' | 'critical';
  connections: number[];
}

const networkNodes: NetworkNode[] = [
  { id: 'N1', x: 50, y: 20, type: 'server', label: 'Main Server', status: 'secure', connections: [1, 2, 3] },
  { id: 'N2', x: 20, y: 50, type: 'firewall', label: 'Firewall-01', status: 'secure', connections: [0, 4] },
  { id: 'N3', x: 50, y: 50, type: 'database', label: 'DB Primary', status: 'warning', connections: [0, 5] },
  { id: 'N4', x: 80, y: 50, type: 'server', label: 'Web Server', status: 'secure', connections: [0, 6] },
  { id: 'N5', x: 15, y: 80, type: 'threat', label: 'Intrusion Detected', status: 'critical', connections: [1] },
  { id: 'N6', x: 50, y: 80, type: 'database', label: 'DB Replica', status: 'secure', connections: [2] },
  { id: 'N7', x: 85, y: 80, type: 'threat', label: 'DDoS Attack', status: 'critical', connections: [3] },
];

export function NetworkGraph() {
  const [pulsingNodes, setPulsingNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newPulsing = new Set<number>();
      networkNodes.forEach((node, idx) => {
        if (node.status === 'critical' || Math.random() > 0.7) {
          newPulsing.add(idx);
        }
      });
      setPulsingNodes(newPulsing);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'firewall': return Shield;
      case 'database': return Database;
      case 'threat': return AlertTriangle;
      default: return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'var(--c2-toxic)';
      case 'warning': return '#FFA500';
      case 'critical': return 'var(--c2-crimson)';
      default: return 'var(--c2-cyan)';
    }
  };

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden p-6"
      style={{
        backgroundColor: 'rgba(10, 14, 19, 0.8)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
      }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="net-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--c2-cyan)" />
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--c2-cyan)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#net-grid)" />
        </svg>
      </div>

      {/* Network Connections */}
      <svg className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] pointer-events-none">
        {networkNodes.map((node, idx) => 
          node.connections.map(targetIdx => {
            const target = networkNodes[targetIdx];
            const isPulsing = pulsingNodes.has(idx) || pulsingNodes.has(targetIdx);
            const isThreatConnection = node.status === 'critical' || target.status === 'critical';

            return (
              <line
                key={`${idx}-${targetIdx}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={isThreatConnection ? 'var(--c2-crimson)' : 'var(--c2-cyan)'}
                strokeWidth={isPulsing ? "3" : "2"}
                opacity={isPulsing ? "0.8" : "0.3"}
                strokeDasharray={isThreatConnection ? "8 4" : "none"}
                className={isPulsing ? "animate-pulse" : ""}
                style={{
                  filter: isPulsing ? `drop-shadow(0 0 6px ${isThreatConnection ? 'var(--c2-crimson)' : 'var(--c2-cyan)'})` : 'none',
                }}
              />
            );
          })
        )}

        {/* Data Flow Particles */}
        {networkNodes.slice(0, 3).map((node, idx) => 
          node.connections.map((targetIdx, connIdx) => {
            const target = networkNodes[targetIdx];
            return (
              <circle key={`particle-${idx}-${connIdx}`} r="2" fill="var(--c2-cyan)" opacity="0.8">
                <animateMotion
                  dur={`${3 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                  path={`M ${node.x},${node.y} L ${target.x},${target.y}`}
                  begin={`${Math.random() * 2}s`}
                />
              </circle>
            );
          })
        )}
      </svg>

      {/* Network Nodes */}
      {networkNodes.map((node, idx) => {
        const Icon = getNodeIcon(node.type);
        const isPulsing = pulsingNodes.has(idx);

        return (
          <div
            key={node.id}
            className="absolute group cursor-pointer z-10"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Glow Effect */}
            {(node.status === 'critical' || isPulsing) && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: getStatusColor(node.status),
                  opacity: 0.3,
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                }}
              />
            )}

            {/* Node Container */}
            <div
              className="relative backdrop-blur-md rounded-xl p-3 transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: 'rgba(22, 27, 34, 0.8)',
                border: `2px solid ${getStatusColor(node.status)}`,
                boxShadow: `0 0 20px ${getStatusColor(node.status)}40`,
              }}
            >
              <Icon 
                className="w-6 h-6"
                style={{ 
                  color: getStatusColor(node.status),
                  filter: `drop-shadow(0 0 4px ${getStatusColor(node.status)})`,
                }}
              />

              {/* Status Indicator */}
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: getStatusColor(node.status),
                  borderColor: 'var(--c2-darker-surface)',
                }}
              />
            </div>

            {/* Label */}
            <div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(13, 17, 23, 0.95)',
                border: `1px solid ${getStatusColor(node.status)}`,
                color: getStatusColor(node.status),
              }}
            >
              <div className="font-bold">{node.id}</div>
              <div className="text-gray-400 text-[10px]">{node.label}</div>
            </div>
          </div>
        );
      })}

      {/* Header */}
      <div 
        className="absolute top-4 left-4 px-3 py-1.5 rounded font-mono text-xs backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          color: 'var(--c2-cyan)',
        }}
      >
        NETWORK TOPOLOGY
      </div>

      {/* Threat Counter */}
      <div 
        className="absolute top-4 right-4 px-3 py-1.5 rounded font-mono text-xs backdrop-blur-md flex items-center gap-2"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 75, 75, 0.3)',
        }}
      >
        <AlertTriangle className="w-3 h-3" style={{ color: 'var(--c2-crimson)' }} />
        <span style={{ color: 'var(--c2-crimson)' }}>
          2 ACTIVE THREATS
        </span>
      </div>
    </div>
  );
}
