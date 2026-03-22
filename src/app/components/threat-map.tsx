import { useEffect, useState, useMemo } from "react";
import { 
  AlertTriangle, Shield, Zap, Globe, 
  Crosshair, Radio, Activity, ShieldAlert,
  Terminal, Lock, Unlock, Database
} from "lucide-react";

// --- INTERFACES ---
interface ThreatNode {
  id: string;
  lat: number;
  lng: number;
  type: 'attack' | 'defense' | 'compromised';
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  uptime: string;
}

interface Connection {
  from: number;
  to: number;
  type: 'attack' | 'data' | 'command';
  payloadSize: string;
}

// --- DATASET ---
const threatNodes: ThreatNode[] = [
  { id: 'TGT-NYC-01', lat: 40.7128, lng: -74.0060, type: 'defense', severity: 'low', label: 'NEW_YORK_GATEWAY', uptime: '142d' },
  { id: 'TGT-LON-02', lat: 51.5074, lng: -0.1278, type: 'compromised', severity: 'critical', label: 'LONDON_SUBSTATION', uptime: '12h' },
  { id: 'TGT-TYO-03', lat: 35.6762, lng: 139.6503, type: 'attack', severity: 'high', label: 'TOKYO_PROXY_NODE', uptime: '4d' },
  { id: 'TGT-SYD-04', lat: -33.8688, lng: 151.2093, type: 'defense', severity: 'medium', label: 'SYDNEY_BACKUP', uptime: '89d' },
  { id: 'TGT-MOS-05', lat: 55.7558, lng: 37.6173, type: 'attack', severity: 'critical', label: 'MOSCOW_C2_SERVER', uptime: '15m' },
  { id: 'TGT-SFO-06', lat: 37.7749, lng: -122.4194, type: 'compromised', severity: 'high', label: 'SF_DATA_CENTER', uptime: '1d' },
  { id: 'TGT-SIN-07', lat: 1.3521, lng: 103.8198, type: 'defense', severity: 'low', label: 'SINGAPORE_HUB', uptime: '210d' },
  { id: 'TGT-DXB-08', lat: 25.2048, lng: 55.2708, type: 'attack', severity: 'medium', label: 'DUBAI_SCANNER', uptime: '45d' },
  { id: 'TGT-TAS-09', lat: 41.2995, lng: 69.2401, type: 'defense', severity: 'high', label: 'TASHKENT_SOC', uptime: '32d' },
];

const connections: Connection[] = [
  { from: 2, to: 1, type: 'attack', payloadSize: '450KB' },
  { from: 4, to: 8, type: 'attack', payloadSize: '1.2MB' },
  { from: 0, to: 3, type: 'command', payloadSize: '12KB' },
  { from: 2, to: 5, type: 'data', payloadSize: '8.4MB' },
  { from: 7, to: 6, type: 'attack', payloadSize: '220KB' },
  { from: 4, to: 1, type: 'attack', payloadSize: '3.1MB' },
  { from: 8, to: 0, type: 'command', payloadSize: '4KB' },
];

export function ThreatMap() {
  const [activeAttacks, setActiveAttacks] = useState<Set<number>>(new Set());
  const [time, setTime] = useState(new Date());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Real-time dinamika
  useEffect(() => {
    const interval = setInterval(() => {
      const newAttacks = new Set<number>();
      connections.forEach((_, idx) => {
        if (Math.random() > 0.4) newAttacks.add(idx);
      });
      setActiveAttacks(newAttacks);
      setTime(new Date());

      // Log yangilash
      if (Math.random() > 0.7) {
        const randomNode = threatNodes[Math.floor(Math.random() * threatNodes.length)];
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ALERT: Node ${randomNode.id} status changed.`, ...prev.slice(0, 4)]);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Proyeksiya hisob-kitoblari
  const latToY = (lat: number) => ((90 - lat) / 180) * 100;
  const lngToX = (lng: number) => ((lng + 180) / 360) * 100;

  const getNodeColor = (type: string) => {
    if (type === 'attack') return '#FF3131';
    if (type === 'compromised') return '#FF6B00';
    return '#00F0FF';
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-[#05070a] border border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] font-mono">
      
      {/* 1. ANIMATED BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="hex-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F0FF" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="map-shadow">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-grid)" />
          <circle cx="50%" cy="50%" r="40%" fill="url(#map-shadow)" />
        </svg>
      </div>

      {/* 2. ATTACK VECTORS (Bezier Curves) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
            <filter id="line-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        {connections.map((conn, idx) => {
          const from = threatNodes[conn.from];
          const to = threatNodes[conn.to];
          const x1 = lngToX(from.lng);
          const y1 = latToY(from.lat);
          const x2 = lngToX(to.lng);
          const y2 = latToY(to.lat);
          const isActive = activeAttacks.has(idx);

          // Egri chiziq uchun boshqaruv nuqtasi (Kaspersky stili)
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - 10; 

          if (!isActive) return null;

          return (
            <g key={`conn-${idx}`} filter="url(#line-glow)">
              <path
                d={`M ${x1}% ${y1}% Q ${midX}% ${midY}% ${x2}% ${y2}%`}
                fill="none"
                stroke={conn.type === 'attack' ? '#FF3131' : '#00F0FF'}
                strokeWidth="1.5"
                strokeDasharray="5,5"
                className="opacity-60 animate-pulse"
              />
              <circle r="2.5" fill="white">
                <animateMotion
                  dur="1.8s"
                  repeatCount="indefinite"
                  path={`M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* 3. NODES LAYER */}
      {threatNodes.map((node) => {
        const x = lngToX(node.lng);
        const y = latToY(node.lat);
        const color = getNodeColor(node.type);
        const isHovered = hoveredNode === node.id;

        return (
          <div
            key={node.id}
            className="absolute z-20 transition-all duration-500"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Critical Pulse */}
            {node.severity === 'critical' && (
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-40" 
                style={{ backgroundColor: color, width: '40px', height: '40px', marginLeft: '-12px', marginTop: '-12px' }} 
              />
            )}

            {/* Main Node Point */}
            <div 
              className={`relative flex items-center justify-center rounded-full border-2 transition-all ${isHovered ? 'scale-150' : 'scale-100'}`}
              style={{ 
                width: '16px', height: '16px', 
                backgroundColor: `${color}20`, 
                borderColor: color,
                boxShadow: isHovered ? `0 0 20px ${color}` : `0 0 10px ${color}40`
              }}
            >
              {node.type === 'attack' ? <Zap size={8} className="text-white"/> : 
               node.type === 'compromised' ? <AlertTriangle size={8} className="text-white"/> : 
               <Shield size={8} className="text-white"/>}
            </div>

            {/* Label Under Node */}
            <div className={`mt-2 text-[9px] font-black tracking-tighter text-center uppercase transition-opacity ${isHovered ? 'opacity-100' : 'opacity-40'}`} style={{ color }}>
                {node.id}
            </div>

            {/* Floating Info Card (Hover) */}
            {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 p-3 bg-black/95 border border-cyan-500/50 rounded shadow-2xl z-50 min-w-[180px] backdrop-blur-xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-2 border-b border-white/10 pb-1">
                        <span className="text-[10px] font-bold text-white uppercase">{node.label}</span>
                        <span className="text-[8px] bg-white/10 px-1 rounded text-gray-400">UP: {node.uptime}</span>
                    </div>
                    <div className="space-y-1 text-[9px]">
                        <div className="flex justify-between"><span className="text-gray-500">LATENCY:</span> <span className="text-cyan-400">12ms</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">TRAFFIC:</span> <span className="text-green-400">NORMAL</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">THREAT_LVL:</span> <span style={{color}} className="font-bold">{node.severity.toUpperCase()}</span></div>
                    </div>
                </div>
            )}
          </div>
        );
      })}

      {/* 4. OVERLAY INTERFACE */}
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="flex gap-4">
            <div className="bg-black/60 border border-cyan-500/30 p-3 rounded backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-black tracking-widest mb-1">
                    <Radio size={14} className="animate-pulse" /> SYSTEM_LIVE_FEED
                </div>
                <div className="text-[10px] text-gray-500 leading-none">GLOBAL_NODES: 09 | ACTIVE_SESSIONS: 124</div>
            </div>
        </div>
        
        <div className="text-right flex flex-col items-end gap-2">
            <div className="bg-black/60 border border-red-500/30 p-2 rounded text-[10px] text-red-500 font-bold flex items-center gap-2">
                <ShieldAlert size={12} /> HIGH_THREAT_DETECTION_ACTIVE
            </div>
            <div className="text-xl font-bold text-white tracking-widest bg-black/40 px-3 py-1 rounded border border-white/5">
                {time.toLocaleTimeString('en-US', { hour12: false })} <span className="text-xs text-gray-500">UTC</span>
            </div>
        </div>
      </div>

      {/* Bottom Controls & Legend */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-30">
        <div className="space-y-3">
            <div className="bg-black/80 border border-white/5 p-4 rounded-lg backdrop-blur-md flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#00F0FF]" />
                    <span className="text-[10px] text-gray-400 uppercase font-black">Secure_Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#FF3131]" />
                    <span className="text-[10px] text-gray-400 uppercase font-black">Malicious_IP</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#FF6B00]" />
                    <span className="text-[10px] text-gray-400 uppercase font-black">Compromised</span>
                </div>
            </div>
            
            {/* Live Mini Log */}
            <div className="w-72 bg-black/40 p-2 rounded border border-white/5 text-[8px] space-y-1">
                {logs.map((log, i) => (
                    <div key={i} className="text-cyan-900 truncate tracking-tight">{log}</div>
                ))}
            </div>
        </div>

        <div className="flex gap-2">
            <button className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition-all">
                <Globe size={18} />
            </button>
            <button className="p-3 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition-all">
                <Terminal size={18} />
            </button>
            <button className="p-3 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition-all">
                <Lock size={18} />
            </button>
        </div>
      </div>

      {/* 5. SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        <div className="h-[2px] w-full bg-cyan-500/20 shadow-[0_0_15px_#00F0FF] animate-scan opacity-30" />
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600px); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
