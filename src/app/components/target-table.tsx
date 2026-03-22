import { useState } from "react";
import { 
  Monitor, Apple, Binary, Circle, ArrowUpDown, Eye, 
  Terminal as TerminalIcon, ShieldAlert, Activity, 
  Globe, Cpu, Database, Zap, HardDrive, Search
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Target interfeysi
interface Target {
  id: string;
  ip: string;
  countryCode: string; // Masalan: 'uz', 'us', 'de'
  countryName: string;
  os: 'windows' | 'macos' | 'linux';
  hostname: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'critical';
  cpu: number;
  ram: number;
  latency: string;
}

const mockTargets: Target[] = [
  { id: 'TGT-4F2A', ip: '192.168.1.105', countryCode: 'uz', countryName: 'UZBEKISTAN', os: 'windows', hostname: 'CORP-WS-01', lastSeen: '2s ago', status: 'online', cpu: 45, ram: 62, latency: '12ms' },
  { id: 'TGT-8B91', ip: '10.0.0.42', countryCode: 'us', countryName: 'USA', os: 'macos', hostname: 'MacBook-Pro', lastSeen: '5s ago', status: 'online', cpu: 23, ram: 48, latency: '45ms' },
  { id: 'TGT-C3E7', ip: '172.16.0.88', countryCode: 'de', countryName: 'GERMANY', os: 'linux', hostname: 'ubuntu-server', lastSeen: '28s ago', status: 'online', cpu: 67, ram: 81, latency: '28ms' },
  { id: 'TGT-D947', ip: '192.168.2.201', countryCode: 'ru', countryName: 'RUSSIA', os: 'windows', hostname: 'DEV-MACHINE', lastSeen: '120ms', status: 'critical', cpu: 89, ram: 95, latency: '120ms' },
  { id: 'TGT-1A5C', ip: '10.10.10.15', countryCode: 'gb', countryName: 'UK', os: 'linux', hostname: 'web-server-01', lastSeen: '---', status: 'offline', cpu: 0, ram: 0, latency: '---' },
  { id: 'TGT-7E2F', ip: '192.168.1.220', countryCode: 'uz', countryName: 'UZBEKISTAN', os: 'windows', hostname: 'ADMIN-PC', lastSeen: '8s ago', status: 'online', cpu: 34, ram: 55, latency: '15ms' },
  { id: 'TGT-9D4B', ip: '172.20.0.99', countryCode: 'jp', countryName: 'JAPAN', os: 'macos', hostname: 'iMac-Design', lastSeen: '15s ago', status: 'online', cpu: 56, ram: 72, latency: '180ms' },
  { id: 'TGT-3C8A', ip: '10.5.5.100', countryCode: 'cn', countryName: 'CHINA', os: 'linux', hostname: 'db-primary', lastSeen: '2m ago', status: 'online', cpu: 78, ram: 88, latency: '95ms' },
];

export function TargetTable() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Dinamik bayroqlar (CDN orqali SVG)
  const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'windows': return <Monitor className="w-4 h-4 text-cyan-400" />;
      case 'macos': return <Apple className="w-4 h-4 text-white" />;
      case 'linux': return <Binary className="w-4 h-4 text-orange-500" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#39ff14';
      case 'critical': return '#ff3131';
      case 'offline': return '#666';
      default: return '#00f0ff';
    }
  };

  return (
    <div className="w-full space-y-4 font-mono">
      {/* Top Controls */}
      <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
            <input 
              type="text" 
              placeholder="FILTER TARGETS..."
              className="bg-black/60 border border-cyan-500/30 rounded pl-10 pr-4 py-1.5 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500 w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-6 w-[1px] bg-cyan-500/20" />
          <div className="text-[11px] text-cyan-500/70">
            TOTAL: <span className="text-white font-bold">{mockTargets.length}</span> | 
            LIVE: <span className="text-[#39ff14] font-bold">{mockTargets.filter(t => t.status === 'online').length}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all">REFRESH_NODE_LIST</button>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-500/10 bg-[#0a0c10]/80 overflow-hidden shadow-2xl backdrop-blur-lg">
        <Table>
          <TableHeader className="bg-cyan-500/5">
            <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
              <TableHead className="py-4 text-cyan-500/50 text-[10px] uppercase font-black pl-6">Node_UID</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black">Geography & IPv4</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black text-center">Env</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black">NetBIOS_Name</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black text-center">Lat</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black">Status</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black w-[180px]">Load_Metrics</TableHead>
              <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black text-right pr-6">Commands</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTargets.map((target) => (
              <TableRow
                key={target.id}
                onClick={() => setSelectedTarget(target.id)}
                className={`group border-b border-white/[0.02] transition-colors cursor-pointer ${
                  selectedTarget === target.id ? 'bg-cyan-500/10' : 'hover:bg-white/[0.03]'
                }`}
              >
                <TableCell className="pl-6 text-xs font-bold text-cyan-500/80">{target.id}</TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-4 overflow-hidden rounded-sm border border-white/10 shadow-sm">
                      <img 
                        src={getFlagUrl(target.countryCode)} 
                        alt={target.countryName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white font-bold tracking-tight">{target.ip}</span>
                      <span className="text-[9px] text-gray-500 font-black tracking-widest">{target.countryCode.toUpperCase()} @ {target.countryName}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <div className="p-1.5 bg-black/40 rounded border border-white/5 group-hover:border-cyan-500/30 transition-all">
                      {getOSIcon(target.os)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-xs text-gray-400 group-hover:text-white transition-colors">
                  {target.hostname}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <Zap className={`w-3 h-3 ${parseInt(target.latency) > 80 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`} />
                    <span className="text-[9px] text-gray-500">{target.latency}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded border bg-black/20"
                    style={{ borderColor: `${getStatusColor(target.status)}44`, color: getStatusColor(target.status) }}
                  >
                    <div 
                        className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px]`} 
                        style={{ backgroundColor: getStatusColor(target.status), shadowColor: getStatusColor(target.status) }} 
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest">{target.status}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2.5">
                    {/* CPU Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase">
                        <span>Processor</span>
                        <span style={{ color: target.cpu > 80 ? '#ff3131' : '#00f0ff' }}>{target.cpu}%</span>
                      </div>
                      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000 shadow-[0_0_10px_#00f0ff33]"
                          style={{ 
                            width: `${target.cpu}%`, 
                            backgroundColor: target.cpu > 80 ? '#ff3131' : '#00f0ff' 
                          }}
                        />
                      </div>
                    </div>
                    {/* RAM Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase">
                        <span>Memory</span>
                        <span style={{ color: target.ram > 80 ? '#ff3131' : '#f7ff00' }}>{target.ram}%</span>
                      </div>
                      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000 shadow-[0_0_10px_#f7ff0033]"
                          style={{ 
                            width: `${target.ram}%`, 
                            backgroundColor: target.ram > 80 ? '#ff3131' : '#f7ff00' 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <button className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-sm">
                      <Eye size={14} />
                    </button>
                    <button className="p-2 rounded bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black transition-all shadow-sm">
                      <TerminalIcon size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/40 rounded-lg border border-white/5 text-[10px] text-gray-500">
        <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2"><HardDrive size={12}/> DATA_ENCRYPTION: <span className="text-green-500 font-bold underline">AES-256_ACTIVE</span></span>
            <span className="flex items-center gap-2"><Globe size={12}/> ACTIVE_REGIONS: <span className="text-white font-bold">8_NODES</span></span>
        </div>
        <div className="flex items-center gap-2">
            <span className="animate-pulse text-cyan-500 font-bold italic">LISTENING FOR INCOMING PACKETS...</span>
        </div>
      </div>
    </div>
  );
}
