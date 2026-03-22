import { useEffect, useState, useMemo } from "react";
import { 
  AlertTriangle, Shield, Zap, Globe, 
  Activity, ShieldAlert, Terminal, Lock, 
  Radar, Target, Cpu, HardDrive
} from "lucide-react";

// --- TIPLAR VA INTERFEYSLAR ---
interface ThreatNode {
  id: string;
  lat: number;
  lng: number;
  type: 'attack' | 'defense' | 'compromised';
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  os: string;
  ip: string;
}

interface Connection {
  id: string;
  from: number;
  to: number;
  type: 'attack' | 'data' | 'command';
  magnitude: number;
}

// --- MA'LUMOTLAR TOPLAMI ---
const threatNodes: ThreatNode[] = [
  { id: 'NODE-001', lat: 40.7128, lng: -74.0060, type: 'defense', severity: 'low', label: 'NYC_SEC_GATEWAY', os: 'NexusOS v4.2', ip: '192.168.1.102' },
  { id: 'NODE-002', lat: 51.5074, lng: -0.1278, type: 'compromised', severity: 'critical', label: 'LONDON_CORE_SRV', os: 'Ubuntu 22.04 LTS', ip: '10.0.4.15' },
  { id: 'NODE-003', lat: 35.6762, lng: 139.6503, type: 'attack', severity: 'high', label: 'TOKYO_PROXY_HIVE', os: 'Kali Linux', ip: '172.16.0.44' },
  { id: 'NODE-004', lat: -33.8688, lng: 151.2093, type: 'defense', severity: 'medium', label: 'SYDNEY_BACKUP', os: 'RHEL 9.0', ip: '192.168.10.5' },
  { id: 'NODE-005', lat: 55.7558, lng: 37.6173, type: 'attack', severity: 'critical', label: 'MOSCOW_C2_UNIT', os: 'Unknown (Encrypted)', ip: '82.145.4.11' },
  { id: 'NODE-006', lat: 37.7749, lng: -122.4194, type: 'compromised', severity: 'high', label: 'SF_DATA_CLUSTER', os: 'Debian 11', ip: '10.55.2.8' },
  { id: 'NODE-007', lat: 41.2995, lng: 69.2401, type: 'defense', severity: 'high', label: 'TASHKENT_SOC_HUB', os: 'Nexus_Core_Z', ip: '213.230.96.1' },
  { id: 'NODE-008', lat: 25.2048, lng: 55.2708, type: 'attack', severity: 'medium', label: 'DUBAI_SCANNER', os: 'CentOS 7', ip: '94.200.1.22' },
];

const connections: Connection[] = [
  { id: 'c1', from: 2, to: 1, type: 'attack', magnitude: 45 },
  { id: 'c2', from: 4, to: 6, type: 'attack', magnitude: 92 },
  { id: 'c3', from: 0, to: 3, type: 'command', magnitude: 12 },
  { id: 'c4', from: 2, to: 5, type: 'data', magnitude: 65 },
  { id: 'c5', from: 7, to: 4, type: 'command', magnitude: 30 },
  { id: 'c6', from: 4, to: 1, type: 'attack', magnitude: 88 },
];

export function ThreatMap() {
  const [activeAttacks, setActiveAttacks] = useState<Set<string>>(new Set());
  const [time, setTime] = useState(new Date());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<{msg: string, type: string}[]>([]);

  // Dinamik Loglar va Hujumlar Simulyatsiyasi
  useEffect(() => {
    const interval = setInterval(() => {
      const newAttacks = new Set<string>();
      connections.forEach((c) => {
        if (Math.random() > 0.4) newAttacks.add(c.id);
      });
      setActiveAttacks(newAttacks);
      setTime(new Date());

      // Tasodifiy loglar generatsiyasi
      if (Math.random() > 0.7) {
        const randomNode = threatNodes[Math.floor(Math.random() * threatNodes.length)];
        const alerts = ["PACKET_LOSS", "UNAUTHORIZED_ACCESS", "DDoS_DETECTED", "FIREWALL_BYPASS"];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        setSystemLogs(prev => [{msg: `[${alert}] at Node ${randomNode.id}`, type: randomNode.type}, ...prev].slice(0, 5));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const latToY = (lat: number) => ((90 - lat) / 180) * 100;
  const lngToX = (lng: number) => ((lng + 180) / 360) * 100;

  const getColor = (type: string) => {
    if (type === 'attack') return '#FF3131';
    if (type === 'compromised') return '#FF6B00';
    return '#00F0FF';
  };

  return (
    <div className="relative w-full h-[700px] bg-[#05070a] rounded-2xl border border-cyan-500/20 shadow-[0_0_60px_-15px_rgba(0,240,255,0.1)] overflow-hidden font-mono">
      
      {/* 1. LAYER: ANIMATED GRID & WORLD OVERLAY */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F0FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* 2. LAYER: CONNECTION VECTORS (Kaspersky Style Curves) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3131" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF3131" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF3131" stopOpacity="0" />
          </linearGradient>
        </defs>
        {connections.map((conn) => {
          const from = threatNodes[conn.from];
          const to = threatNodes[conn.to];
          const x1 = lngToX(from.lng);
          const y1 = latToY(from.lat);
          const x2 = lngToX(to.lng);
          const y2 = latToY(to.lat);
          const isActive = activeAttacks.has(conn.id);

          // Egri chiziq (Bezier Curve) hisoblagichi
          const dx = x2 - x1;
          const dy = y2 - y1;
          const dr = Math.sqrt(dx * dx + dy * dy) * 0.8; // Egilish radiusi

          if (!isActive) return null;

          return (
            <g key={conn.id}>
              <path
                d={`M ${x1}% ${y1}% A ${dr} ${dr} 0 0 1 ${x2}% ${y2}%`}
                fill="none"
                stroke={getColor(conn.type)}
                strokeWidth={isActive ? "1.5" : "0.5"}
                opacity={isActive ? "0.6" : "0.2"}
                strokeDasharray="4 2"
                className="animate-pulse"
              />
              <circle r="2" fill="#fff">
                <animateMotion
                  dur={`${3 - (conn.magnitude / 50)}s`}
                  repeatCount="indefinite"
                  path={`M ${x1},${y1} A ${dr} ${dr} 0 0 1 ${x2},${y2}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* 3. LAYER: THREAT NODES */}
      {threatNodes.map((node) => {
        const x = lngToX(node.lng);
        const y = latToY(node.lat);
        const nodeColor = getColor(node.type);
        const isHovered = hoveredNode === node.id;

        return (
          <div
            key={node.id}
            className="absolute z-20 transition-all duration-300"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Ping Animatsiyasi */}
            {node.severity === 'critical' && (
              <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping opacity-30" style={{ backgroundColor: nodeColor }} />
            )}

            {/* Asosiy Nuqta */}
            <div 
              className={`relative w-4 h-4 rounded-full border-2 cursor-crosshair transition-transform ${isHovered ? 'scale-150' : 'scale-100'}`}
              style={{ backgroundColor: `${nodeColor}40`, borderColor: nodeColor, boxShadow: `0 0 15px ${nodeColor}` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {node.type === 'attack' ? <Zap size={8} className="text-white"/> : <Shield size={8} className="text-white"/>}
              </div>
            </div>

            {/* Hover Tooltip - Detail View */}
            {isHovered && (
              <div className="absolute top-6 left-6 w-48 bg-black/90 border border-cyan-500/50 p-3 rounded shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="text-[10px] font-black text-cyan-400 mb-1 border-b border-cyan-500/20 pb-1">{node.id}</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px]"><span className="text-gray-500">TAG:</span> <span className="text-white uppercase">{node.label}</span></div>
                  <div className="flex justify-between text-[9px]"><span className="text-gray-500">IP:</span> <span className="text-white">{node.ip}</span></div>
                  <div className="flex justify-between text-[9px]"><span className="text-gray-500">OS:</span> <span className="text-green-500">{node.os}</span></div>
                  <div className="flex justify-between text-[9px] font-bold"><span className="text-gray-500">THREAT:</span> <span style={{color: nodeColor}}>{node.severity.toUpperCase()}</span></div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 4. INTERFACE OVERLAYS */}
      
      {/* Header Paneli */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-30">
        <div className="flex gap-4">
          <div className="bg-black/60 border border-cyan-500/30 p-4 rounded-lg backdrop-blur-md">
            <div className="flex items-center gap-3 text-cyan-400 mb-1">
              <Radar className="w-5 h-5 animate-spin-slow" />
              <span className="text-sm font-black tracking-widest">NEXUS_GLOBAL_SCAN</span>
            </div>
            <div className="text-[10px] text-gray-500 uppercase">Status: <span className="text-green-500">Live_Tracking_Enabled</span></div>
          </div>
        </div>

        <div className="bg-black/60 border border-red-500/30 p-4 rounded-lg backdrop-blur-md text-right">
          <div className="text-xs text-red-500 font-bold mb-1 flex items-center justify-end gap-2">
            <ShieldAlert size={14} className="animate-pulse" /> HIGH_THREAT_ACTIVITY
          </div>
          <div className="text-2xl font-black text-white tracking-[0.2em]">
            {time.toLocaleTimeString('en-US', { hour12: false })} <span className="text-xs text-gray-500 uppercase">UTC</span>
          </div>
        </div>
      </div>

      {/* Statistikalar va Loglar (Chap-Past) */}
      <div className="absolute bottom-6 left-6 w-80 space-y-4 z-30">
        <div className="bg-black/80 border border-white/5 p-4 rounded-lg backdrop-blur-md">
          <div className="text-[10px] text-cyan-500 font-black mb-2 uppercase border-b border-cyan-500/20 pb-1">Live_System_Logs</div>
          <div className="space-y-1 h-24 overflow-hidden">
            {systemLogs.map((log, i) => (
              <div key={i} className="text-[9px] flex items-center gap-2 animate-in slide-in-from-left duration-300">
                <span className="text-gray-600">[{time.getSeconds()}s]</span>
                <span style={{ color: getColor(log.type) }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend va Boshqaruv (O'ng-Past) */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 z-30">
        <div className="flex gap-4 bg-black/60 p-3 rounded-lg border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00F0FF]" /><span className="text-[10px] text-gray-400 uppercase">Defense</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF6B00]" /><span className="text-[10px] text-gray-400 uppercase">Breach</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF3131]" /><span className="text-[10px] text-gray-400 uppercase">Attack</span></div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-400 hover:text-black transition-all group">
            <Terminal size={18} className="group-active:scale-90" />
          </button>
          <button className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-400 hover:text-black transition-all">
            <Lock size={18} />
          </button>
          <button className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-400 hover:text-black transition-all">
            <Activity size={18} />
          </button>
        </div>
      </div>

      {/* 5. LAYER: SCANLINE & GLARE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 shadow-[0_0_15px_#00F0FF] animate-scanline" />
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 700px; }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
