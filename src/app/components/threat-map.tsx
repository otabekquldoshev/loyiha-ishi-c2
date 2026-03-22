import { useEffect, useState, useMemo } from "react";
import { 
  AlertTriangle, Shield, Zap, Globe, 
  Activity, ShieldAlert, Terminal, Lock, 
  Radar, Target, Cpu, HardDrive, Search,
  Settings, Maximize2, BarChart3
} from "lucide-react";

// --- 1. INTERFEYSLAR (Ma'lumotlar strukturasi) ---
interface ThreatNode {
  id: string;
  lat: number;
  lng: number;
  type: 'attack' | 'defense' | 'compromised';
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  ip: string;
  country: string;
}

interface AttackLog {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  method: string;
  status: 'blocked' | 'active' | 'detected';
}

// --- 2. ASOSIY MA'LUMOTLAR ---
const threatNodes: ThreatNode[] = [
  { id: 'N-USA-01', lat: 40.7128, lng: -74.0060, type: 'defense', severity: 'low', label: 'NYC_GATEWAY', ip: '192.168.1.1', country: 'USA' },
  { id: 'N-UK-02', lat: 51.5074, lng: -0.1278, type: 'compromised', severity: 'critical', label: 'LON_CORE', ip: '10.0.4.15', country: 'UK' },
  { id: 'N-JPN-03', lat: 35.6762, lng: 139.6503, type: 'attack', severity: 'high', label: 'TYO_NODE', ip: '172.16.0.44', country: 'JPN' },
  { id: 'N-AUS-04', lat: -33.8688, lng: 151.2093, type: 'defense', severity: 'medium', label: 'SYD_BACKUP', ip: '192.168.10.5', country: 'AUS' },
  { id: 'N-RUS-05', lat: 55.7558, lng: 37.6173, type: 'attack', severity: 'critical', label: 'MOS_UNIT', ip: '82.145.4.11', country: 'RUS' },
  { id: 'N-UZB-01', lat: 41.2995, lng: 69.2401, type: 'defense', severity: 'high', label: 'TAS_SOC_HUB', ip: '213.230.96.1', country: 'UZB' },
  { id: 'N-UAE-08', lat: 25.2048, lng: 55.2708, type: 'attack', severity: 'medium', label: 'DXB_SCAN', ip: '94.200.1.22', country: 'UAE' },
];

const initialLogs: AttackLog[] = [
  { id: 'L1', timestamp: '12:44:01', source: 'MOS_UNIT', target: 'NYC_GATEWAY', method: 'DDoS', status: 'active' },
  { id: 'L2', timestamp: '12:44:05', source: 'TYO_NODE', target: 'TAS_SOC_HUB', method: 'Brute Force', status: 'blocked' },
];

export function ThreatMap() {
  const [activeAttacks, setActiveAttacks] = useState<number[]>([]);
  const [logs, setLogs] = useState<AttackLog[]>(initialLogs);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // Dinamik yangilanish mantiqi
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Tasodifiy hujum animatsiyasi
      const newActive = Array.from({ length: 3 }, () => Math.floor(Math.random() * threatNodes.length));
      setActiveAttacks(newActive);

      // Loglarni yangilash
      if (Math.random() > 0.6) {
        const newLog: AttackLog = {
          id: `L${Math.random()}`,
          timestamp: new Date().toLocaleTimeString().split(' ')[0],
          source: threatNodes[Math.floor(Math.random() * threatNodes.length)].label,
          target: threatNodes[Math.floor(Math.random() * threatNodes.length)].label,
          method: ['SQLi', 'XSS', 'Malware', 'Phishing'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.5 ? 'blocked' : 'active'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 8));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Koordinatalarni foizga o'tkazish
  const getPos = (lat: number, lng: number) => ({
    y: ((90 - lat) / 180) * 100,
    x: ((lng + 180) / 360) * 100
  });

  return (
    <div className="flex flex-col w-full h-screen bg-[#020408] text-cyan-500 font-mono overflow-hidden border border-cyan-900/50">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="h-16 border-b border-cyan-900/50 bg-black/40 flex items-center justify-between px-6 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse text-red-500" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter text-white">NEXUS_TERMINAL_V2</h1>
            <p className="text-[10px] text-cyan-700 tracking-[0.3em]">GLOBAL THREAT INTELLIGENCE</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-[10px] tracking-widest uppercase">
            <div className="flex flex-col"><span className="text-gray-600">Active Threats</span><span className="text-red-500">1,244</span></div>
            <div className="flex flex-col"><span className="text-gray-600">Nodes Online</span><span className="text-green-500">89%</span></div>
            <div className="flex flex-col"><span className="text-gray-600">System Load</span><span className="text-cyan-500">24%</span></div>
          </div>
          <div className="text-xl font-bold text-white tabular-nums border-l border-cyan-900/50 pl-8">
            {time.toLocaleTimeString('en-GB')}
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex">
        
        {/* --- LEFT SIDEBAR: LIVE ATTACK FEED --- */}
        <aside className="w-80 border-r border-cyan-900/50 bg-black/20 backdrop-blur-sm p-4 z-40 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold border-b border-cyan-900/30 pb-2">
            <Terminal size={14} /> LIVE_ATTACK_FEED
          </div>
          <div className="flex-1 overflow-hidden space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-2 bg-white/5 border border-white/5 rounded text-[10px] animate-in slide-in-from-left duration-500">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">{log.timestamp}</span>
                  <span className={log.status === 'blocked' ? 'text-green-500' : 'text-red-500'}>[{log.status}]</span>
                </div>
                <div className="truncate text-gray-300">
                  <span className="text-cyan-600">{log.source}</span> → {log.target}
                </div>
                <div className="mt-1 text-gray-500 italic">Method: {log.method}</div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-red-900/10 border border-red-900/30 rounded text-[9px] text-red-400">
            CRITICAL: Potential breach detected in Sector 7-G. Initiate protocol 9.
          </div>
        </aside>

        {/* --- CENTER: MAIN THREAT MAP --- */}
        <section className="flex-1 relative overflow-hidden">
          {/* Map Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Svg Layer for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {activeAttacks.map((idx, i) => {
              const from = threatNodes[idx];
              const to = threatNodes[(idx + 1) % threatNodes.length];
              const p1 = getPos(from.lat, from.lng);
              const p2 = getPos(to.lat, to.lng);
              
              return (
                <g key={i}>
                  <path
                    d={`M ${p1.x}% ${p1.y}% Q ${(p1.x+p2.x)/2}% ${(p1.y+p2.y)/2 - 10}% ${p2.x}% ${p2.y}%`}
                    stroke="rgba(255, 49, 49, 0.4)"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  <circle r="2" fill="#ff3131">
                    <animateMotion dur="2s" repeatCount="indefinite" path={`M 0,0 Q 50, -20 100, 0`} />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Node Points */}
          {threatNodes.map((node) => {
            const pos = getPos(node.lat, node.lng);
            const isHovered = hoveredNode === node.id;
            
            return (
              <div 
                key={node.id}
                className="absolute z-20"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className={`relative w-3 h-3 rounded-full border-2 transition-all duration-300 ${isHovered ? 'scale-150' : ''}`}
                     style={{ 
                       borderColor: node.type === 'attack' ? '#ff3131' : '#00f0ff',
                       backgroundColor: node.type === 'attack' ? '#ff313144' : '#00f0ff44',
                       boxShadow: `0 0 15px ${node.type === 'attack' ? '#ff3131' : '#00f0ff'}`
                     }}>
                  {node.severity === 'critical' && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-50" />
                  )}
                </div>
                
                {isHovered && (
                  <div className="absolute top-4 left-4 w-40 bg-[#05070a] border border-cyan-500/50 p-2 rounded text-[9px] backdrop-blur-xl z-50">
                    <p className="text-white font-bold border-b border-white/10 pb-1 mb-1">{node.label}</p>
                    <p>IP: {node.ip}</p>
                    <p>LOC: {node.country}</p>
                    <p className={node.type === 'attack' ? 'text-red-500' : 'text-cyan-500'}>TYPE: {node.type.toUpperCase()}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Map Overlay Controls */}
          <div className="absolute bottom-6 left-6 flex gap-2 z-40">
            <button className="p-2 bg-black/60 border border-cyan-900/50 rounded hover:bg-cyan-500/20 transition-all"><Maximize2 size={16}/></button>
            <button className="p-2 bg-black/60 border border-cyan-900/50 rounded hover:bg-cyan-500/20 transition-all"><Search size={16}/></button>
            <button className="p-2 bg-black/60 border border-cyan-900/50 rounded hover:bg-cyan-500/20 transition-all"><Settings size={16}/></button>
          </div>
        </section>

        {/* --- RIGHT SIDEBAR: NODE STATISTICS --- */}
        <aside className="w-80 border-l border-cyan-900/50 bg-black/20 backdrop-blur-sm p-4 z-40 flex flex-col gap-6">
          <div className="space-y-4">
            <div className="text-xs font-bold flex items-center gap-2 border-b border-cyan-900/30 pb-2">
              <BarChart3 size={14} /> THREAT_DISTRIBUTION
            </div>
            <div className="space-y-3">
              <StatBar label="Malware" value={78} color="bg-red-500" />
              <StatBar label="Phishing" value={45} color="bg-orange-500" />
              <StatBar label="DDoS" value={92} color="bg-purple-500" />
              <StatBar label="SQLi" value={12} color="bg-cyan-500" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-bold flex items-center gap-2 border-b border-cyan-900/30 pb-2">
              <Activity size={14} /> HARDWARE_STATUS
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <p className="text-[8px] text-gray-500">CPU_USAGE</p>
                <p className="text-xs font-bold">42.8%</p>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <p className="text-[8px] text-gray-500">MEMORY</p>
                <p className="text-xs font-bold">12.4GB</p>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <p className="text-[8px] text-gray-500">UPLINK</p>
                <p className="text-xs font-bold text-green-500">Stable</p>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <p className="text-[8px] text-gray-500">ENCRYPTION</p>
                <p className="text-xs font-bold text-cyan-500">AES-256</p>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-cyan-900/30 pt-4">
            <div className="flex justify-between items-center text-[10px] text-gray-600 mb-2 uppercase">
              <span>Security Level</span>
              <span className="text-red-500">Elevated</span>
            </div>
            <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-3/4 animate-pulse" />
            </div>
          </div>
        </aside>
      </main>

      {/* --- FOOTER: SYSTEM STATUS LINE --- */}
      <footer className="h-8 border-t border-cyan-900/50 bg-black/60 px-6 flex items-center justify-between text-[9px] tracking-widest text-cyan-800">
        <div className="flex gap-6">
          <span>SEC_CORE: ACTIVE</span>
          <span>ENCRYPTION_LAYER: ON</span>
          <span>DATABASE_SYNC: OK</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ALL SYSTEMS OPERATIONAL</span>
          <span className="text-gray-600">© 2026 NEXUS_CYBER_SOC</span>
        </div>
      </footer>

      {/* Global CSS Effects */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(to right, transparent, rgba(0, 240, 255, 0.2), transparent);
          animation: scanline 10s linear infinite;
          pointer-events: none;
          z-index: 100;
        }
      `}</style>
      <div className="animate-scanline" />
    </div>
  );
}

// --- YORDAMCHI KOMPONENTLAR ---
function StatBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] uppercase tracking-tighter text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
