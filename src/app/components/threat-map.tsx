import { useEffect, useState, useMemo } from "react";
import { 
  AlertTriangle, Shield, Zap, Globe, 
  Activity, ShieldAlert, Terminal, Lock, 
  Radar, Target, Cpu, HardDrive, Search,
  Settings, Maximize2, BarChart3, ChevronRight,
  Eye, Server, Database, Wifi
} from "lucide-react";

// --- 1. INTERFEYSLAR VA TIPLAR ---
interface ThreatNode {
  id: string;
  lat: number;
  lng: number;
  type: 'attack' | 'defense' | 'compromised';
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  ip: string;
  country: string;
  os: string;
  status: 'ONLINE' | 'OFFLINE' | 'CRITICAL';
}

interface Connection {
  id: string;
  from: number;
  to: number;
  type: 'attack' | 'data' | 'command';
  magnitude: number;
}

// --- 2. MA'LUMOTLAR TOPLAMI ---
const threatNodes: ThreatNode[] = [
  { id: 'NODE-001', lat: 40.7128, lng: -74.0060, type: 'defense', severity: 'low', label: 'NYC_SEC_GATEWAY', ip: '192.168.1.102', country: 'USA', os: 'NexusOS v4.2', status: 'ONLINE' },
  { id: 'NODE-002', lat: 51.5074, lng: -0.1278, type: 'compromised', severity: 'critical', label: 'LONDON_CORE_SRV', ip: '10.0.4.15', country: 'UK', os: 'Ubuntu 22.04', status: 'CRITICAL' },
  { id: 'NODE-003', lat: 35.6762, lng: 139.6503, type: 'attack', severity: 'high', label: 'TOKYO_PROXY_HIVE', ip: '172.16.0.44', country: 'JPN', os: 'Kali Linux', status: 'ONLINE' },
  { id: 'NODE-004', lat: -33.8688, lng: 151.2093, type: 'defense', severity: 'medium', label: 'SYDNEY_BACKUP', ip: '192.168.10.5', country: 'AUS', os: 'RHEL 9.0', status: 'ONLINE' },
  { id: 'NODE-005', lat: 55.7558, lng: 37.6173, type: 'attack', severity: 'critical', label: 'MOSCOW_C2_UNIT', ip: '82.145.4.11', country: 'RUS', os: 'Unknown', status: 'ONLINE' },
  { id: 'NODE-006', lat: 37.7749, lng: -122.4194, type: 'compromised', severity: 'high', label: 'SF_DATA_CLUSTER', ip: '10.55.2.8', country: 'USA', os: 'Debian 11', status: 'ONLINE' },
  { id: 'NODE-007', lat: 41.2995, lng: 69.2401, type: 'defense', severity: 'high', label: 'TASHKENT_SOC_HUB', ip: '213.230.96.1', country: 'UZB', os: 'Nexus_Core', status: 'ONLINE' },
  { id: 'NODE-008', lat: 25.2048, lng: 55.2708, type: 'attack', severity: 'medium', label: 'DUBAI_SCANNER', ip: '94.200.1.22', country: 'UAE', os: 'CentOS 7', status: 'ONLINE' },
];

const connections: Connection[] = [
  { id: 'c1', from: 2, to: 1, type: 'attack', magnitude: 45 },
  { id: 'c2', from: 4, to: 6, type: 'attack', magnitude: 92 },
  { id: 'c3', from: 0, to: 3, type: 'command', magnitude: 12 },
  { id: 'c4', from: 2, to: 5, type: 'data', magnitude: 65 },
  { id: 'c5', from: 7, to: 4, type: 'command', magnitude: 30 },
  { id: 'c6', from: 4, to: 1, type: 'attack', magnitude: 88 },
];

// --- 3. ASOSIY KOMPONENT ---
export function ThreatDashboard() {
  const [activeAttacks, setActiveAttacks] = useState<Set<string>>(new Set());
  const [time, setTime] = useState(new Date());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<{id: string, msg: string, type: string, time: string}[]>([]);

  // Dinamika va Simulyatsiya
  useEffect(() => {
    const interval = setInterval(() => {
      const newAttacks = new Set<string>();
      connections.forEach((c) => { if (Math.random() > 0.4) newAttacks.add(c.id); });
      setActiveAttacks(newAttacks);
      setTime(new Date());

      if (Math.random() > 0.6) {
        const randomNode = threatNodes[Math.floor(Math.random() * threatNodes.length)];
        const alerts = ["PACKET_LOSS", "UNAUTHORIZED_ACCESS", "DDoS_DETECTED", "FIREWALL_BYPASS"];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        const newLog = {
          id: Math.random().toString(36).substr(2, 9),
          msg: `[${alert}] at ${randomNode.label}`,
          type: randomNode.type,
          time: new Date().toLocaleTimeString('en-GB').split(' ')[0]
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 15));
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
    <div className="flex flex-col w-full h-screen bg-[#05070a] text-cyan-500 font-mono overflow-hidden">
      
      {/* --- A. HEADER --- */}
      <header className="h-16 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between px-6 shrink-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Radar className="w-6 h-6 animate-spin-slow text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-white">NEXUS_GLOBAL_SCAN</h1>
            <div className="flex gap-3 text-[9px] uppercase tracking-widest text-gray-500">
              <span>Status: <span className="text-green-500">Live_Tracking</span></span>
              <span>Security_Level: <span className="text-red-500 underline">Elevated</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6">
            <TopStat label="ACTIVE_THREATS" val="1,244" color="text-red-500" />
            <TopStat label="NODES_ONLINE" val="98.2%" color="text-green-500" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums border-l border-cyan-500/20 pl-6">
            {time.toLocaleTimeString('en-GB')} <span className="text-[10px] text-gray-500 font-normal">UTC</span>
          </div>
        </div>
      </header>

      {/* --- B. MAIN CONTENT (MAP & SIDEBARS) --- */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* CHAP PANEL: SYSTEM LOGS */}
        <aside className="w-72 border-r border-cyan-500/10 bg-black/20 flex flex-col shrink-0">
          <div className="p-4 border-b border-cyan-500/10 flex items-center gap-2 text-[10px] font-bold">
            <Terminal size={14} /> {`>_ SYSTEM_FEED`}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {systemLogs.map((log) => (
              <div key={log.id} className="p-2.5 bg-cyan-500/5 border border-white/5 rounded text-[9px] animate-in slide-in-from-left duration-300">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>[{log.time}]</span>
                  <span style={{ color: getColor(log.type) }}>● {log.type.toUpperCase()}</span>
                </div>
                <div className="text-gray-300 break-words leading-relaxed">{log.msg}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* MARKAZ: WORLD THREAT MAP */}
        <main className="flex-1 relative overflow-hidden">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%"><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F0FF" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#g)" /></svg>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {connections.map((conn) => {
              const from = threatNodes[conn.from];
              const to = threatNodes[conn.to];
              const isActive = activeAttacks.has(conn.id);
              if (!isActive) return null;

              const x1 = lngToX(from.lng); const y1 = latToY(from.lat);
              const x2 = lngToX(to.lng); const y2 = latToY(to.lat);
              const dr = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)) * 1.5;

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${x1}% ${y1}% A ${dr} ${dr} 0 0 1 ${x2}% ${y2}%`}
                    fill="none" stroke={getColor(conn.type)} strokeWidth="1.5"
                    strokeDasharray="4 2" className="animate-pulse opacity-40"
                  />
                  <circle r="2" fill="#fff">
                    <animateMotion dur="2s" repeatCount="indefinite" path={`M ${x1},${y1} A ${dr} ${dr} 0 0 1 ${x2},${y2}`} />
                  </circle>
                </g>
              );
            })}
          </svg>

          {threatNodes.map((node) => {
            const x = lngToX(node.lng); const y = latToY(node.lat);
            const nodeColor = getColor(node.type);
            const isHovered = hoveredNode === node.id;
            return (
              <div key={node.id} className="absolute z-20" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                   onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}>
                <div className={`w-3 h-3 rounded-full border-2 cursor-crosshair transition-transform ${isHovered ? 'scale-150' : ''}`}
                     style={{ backgroundColor: `${nodeColor}40`, borderColor: nodeColor, boxShadow: `0 0 15px ${nodeColor}` }} />
                {isHovered && (
                  <div className="absolute top-4 left-4 w-40 bg-black/90 border border-cyan-500/50 p-2 rounded shadow-2xl backdrop-blur-md z-50 text-[9px]">
                    <div className="font-bold border-b border-cyan-500/20 pb-1 mb-1">{node.id}</div>
                    <div className="text-gray-400 uppercase">{node.label}</div>
                    <div className="text-white">{node.ip}</div>
                    <div className="text-gray-500">{node.os}</div>
                  </div>
                )}
              </div>
            );
          })}
        </main>

        {/* O'NG PANEL: STATS & GAUGES */}
        <aside className="w-72 border-l border-cyan-500/10 bg-black/20 p-5 flex flex-col gap-6 shrink-0">
          <section>
            <div className="text-[10px] font-bold border-b border-cyan-500/20 pb-2 mb-4 uppercase">Attack_Vectors</div>
            <div className="space-y-3">
              <StatBar label="MALWARE" val={82} color="bg-red-500" />
              <StatBar label="PHISHING" val={45} color="bg-orange-500" />
              <StatBar label="DDOS" val={91} color="bg-purple-500" />
            </div>
          </section>
          
          <section className="flex-1">
            <div className="text-[10px] font-bold border-b border-cyan-500/20 pb-2 mb-4 uppercase">Node_Analysis</div>
            <div className="grid grid-cols-2 gap-2">
              <MiniCard icon={<Cpu size={12}/>} label="CPU" val="44%" />
              <MiniCard icon={<Database size={12}/>} label="MEM" val="12GB" />
              <MiniCard icon={<Wifi size={12}/>} label="NET" val="95ms" />
              <MiniCard icon={<Lock size={12}/>} label="SSL" val="Valid" />
            </div>
          </section>
        </aside>
      </div>

      {/* --- C. FOOTER: TARGET TABLE (Eng muhim qism) --- */}
      <footer className="h-64 border-t border-cyan-500/20 bg-black/60 flex flex-col shrink-0 z-50">
        <div className="px-6 py-2 border-b border-cyan-500/10 flex justify-between items-center bg-cyan-500/5">
          <div className="flex gap-6 text-[10px] font-bold tracking-widest uppercase">
            <span>Current_Targets: <span className="text-white">{threatNodes.length}</span></span>
            <span>Intercepted: <span className="text-green-500">14,209</span></span>
          </div>
          <div className="flex gap-2">
             <button className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded"><Search size={14}/></button>
             <button className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded"><Settings size={14}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          <table className="w-full text-left text-[11px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 uppercase text-[9px] tracking-tighter">
                <th className="pb-2">Node_ID</th>
                <th className="pb-2">Endpoint_Address</th>
                <th className="pb-2">Operating_System</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Health_Metrics</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {threatNodes.map((node) => (
                <tr key={node.id} className="bg-white/5 hover:bg-white/10 transition-colors group">
                  <td className="p-3 text-cyan-400 font-bold">{node.id}</td>
                  <td className="p-3">
                    <div className="font-bold text-white leading-none">{node.ip}</div>
                    <div className="text-[9px] text-gray-600 mt-1">{node.country}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Server size={12} className="opacity-30" />
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase text-[9px]">{node.os}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${
                      node.status === 'ONLINE' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 
                      'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="p-3 w-48">
                    <div className="space-y-1.5">
                      <div className="h-1 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[65%]" /></div>
                      <div className="h-1 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[42%]" /></div>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-cyan-500/20 rounded"><Eye size={12}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </footer>

      {/* FX LAYERS */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="w-full h-[2px] bg-cyan-500/5 shadow-[0_0_20px_rgba(0,240,255,0.2)] animate-scan" />
      </div>

      <style>{`
        @keyframes scan { from { top: 0; } to { top: 100%; } }
        .animate-scan { animation: scan 12s linear infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #083344; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- YORDAMCHI KOMPONENTLAR ---
function TopStat({ label, val, color }: { label: string, val: string, color: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[8px] text-gray-600 tracking-tighter uppercase leading-none mb-1">{label}</span>
      <span className={`text-xs font-black ${color} leading-none`}>{val}</span>
    </div>
  );
}

function StatBar({ label, val, color }: { label: string, val: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-gray-500">
        <span>{label}</span><span>{val}%</span>
      </div>
      <div className="h-1 bg-gray-900 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${val}%` }} />
      </div>
    </div>
  );
}

function MiniCard({ icon, label, val }: { icon: any, label: string, val: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-2 rounded flex items-center gap-2 hover:bg-white/10 transition-all">
      <div className="text-cyan-500 opacity-50">{icon}</div>
      <div>
        <div className="text-[7px] text-gray-600 uppercase leading-none">{label}</div>
        <div className="text-[10px] font-bold text-gray-300 leading-none mt-1">{val}</div>
      </div>
    </div>
  );
}
