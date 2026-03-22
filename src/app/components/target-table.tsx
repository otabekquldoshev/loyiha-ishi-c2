import { useState, useMemo } from "react";
import { 
  Monitor, Apple, Binary, Circle, ArrowUpDown, Eye, 
  Terminal as TerminalIcon, Shield, Activity, Globe 
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Target {
  id: string;
  ip: string;
  os: 'windows' | 'macos' | 'linux';
  hostname: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'critical';
  cpu: number;
  ram: number;
  countryCode: string;
}

const mockTargets: Target[] = [
  { id: 'TGT-4F2A', ip: '192.168.1.105', os: 'windows', hostname: 'CORP-WS-01', lastSeen: '2s ago', status: 'online', cpu: 45, ram: 62, countryCode: 'uz' },
  { id: 'TGT-8B91', ip: '10.0.0.42', os: 'macos', hostname: 'MacBook-Pro', lastSeen: '5s ago', status: 'online', cpu: 23, ram: 48, countryCode: 'us' },
  { id: 'TGT-C3E7', ip: '172.16.0.88', os: 'linux', hostname: 'ubuntu-server', lastSeen: '12s ago', status: 'online', cpu: 67, ram: 81, countryCode: 'de' },
  { id: 'TGT-D947', ip: '192.168.2.201', os: 'windows', hostname: 'DEV-MACHINE', lastSeen: '1m ago', status: 'critical', cpu: 89, ram: 95, countryCode: 'ru' },
  { id: 'TGT-1A5C', ip: '10.10.10.15', os: 'linux', hostname: 'web-server-01', lastSeen: '3m ago', status: 'offline', cpu: 0, ram: 0, countryCode: 'cn' },
  { id: 'TGT-7E2F', ip: '192.168.1.220', os: 'windows', hostname: 'ADMIN-PC', lastSeen: '8s ago', status: 'online', cpu: 34, ram: 55, countryCode: 'uz' },
  { id: 'TGT-9D4B', ip: '172.20.0.99', os: 'macos', hostname: 'iMac-Design', lastSeen: '15s ago', status: 'online', cpu: 56, ram: 72, countryCode: 'fr' },
];

export function TargetTable() {
  const [sortField, setSortField] = useState<keyof Target>('lastSeen');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Bayroq emojilarini generatsiya qilish (404 xatosidan xalos bo'lish uchun)
  const getFlagEmoji = (countryCode: string) => {
    const code = countryCode.toUpperCase();
    return code.replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  const sortedTargets = useMemo(() => {
    return [...mockTargets].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection]);

  const handleSort = (field: keyof Target) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)] font-mono">
      
      {/* HEADER SECTION */}
      <div className="px-6 py-5 border-b border-cyan-500/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-[0.25em] text-cyan-400 uppercase leading-tight">
              Nexus Node Monitor
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-bold tracking-wider">
                ACTIVE_TUNNEL: <span className="text-slate-300 px-1">AES-256</span> | NODES: {mockTargets.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
            <div className="text-right mr-4 border-r border-slate-800 pr-4">
                <p className="text-[9px] text-slate-500 uppercase">Global Traffic</p>
                <p className="text-xs text-cyan-400 font-bold">1.2 GB/s</p>
            </div>
            <Activity className="w-8 h-8 text-cyan-500/30" />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900/40">
            <TableRow className="border-cyan-500/10 hover:bg-transparent">
              <TableHead className="pl-6 py-4">
                <button 
                  onClick={() => handleSort('id')} 
                  className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
                >
                  UID <ArrowUpDown size={12} className="opacity-50" />
                </button>
              </TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location / IP</TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Platform</TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connectivity</TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Load</TableHead>
              <TableHead className="pr-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Cmd</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {sortedTargets.map((target) => {
              const isSelected = selectedTarget === target.id;
              
              return (
                <TableRow
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  className={`group transition-all duration-300 border-cyan-500/5 cursor-pointer 
                    ${isSelected ? 'bg-cyan-500/10 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]' : 'hover:bg-cyan-500/5'}`}
                >
                  {/* ID Column */}
                  <TableCell className="pl-6 py-5 font-bold text-xs">
                    <span className={isSelected ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-500"}>
                      {target.id}
                    </span>
                  </TableCell>

                  {/* Flag + IP Column */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl grayscale-[0.5] group-hover:grayscale-0 transition-all filter drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                        {getFlagEmoji(target.countryCode)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 font-bold group-hover:text-cyan-500 transition-colors">
                            {target.ip}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium uppercase">{target.hostname}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* OS Column */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      {target.os === 'windows' && <Monitor className="w-4 h-4 text-blue-400/70" />}
                      {target.os === 'macos' && <Apple className="w-4 h-4 text-slate-300" />}
                      {target.os === 'linux' && <Binary className="w-4 h-4 text-orange-400/70" />}
                      <span className="text-[9px] text-slate-600 uppercase font-black">{target.os}</span>
                    </div>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px] 
                                ${target.status === 'online' ? 'bg-green-500 shadow-green-500' : 
                                  target.status === 'critical' ? 'bg-red-500 shadow-red-500' : 'bg-slate-600 shadow-transparent'}`} 
                            />
                            <span className={`text-[10px] font-black uppercase tracking-tighter
                                ${target.status === 'online' ? 'text-green-500' : 
                                  target.status === 'critical' ? 'text-red-500' : 'text-slate-600'}`}>
                                {target.status}
                            </span>
                        </div>
                        <span className="text-[9px] text-slate-600 font-mono">Pings: {target.lastSeen}</span>
                    </div>
                  </TableCell>

                  {/* Resource Column */}
                  <TableCell>
                    <div className="flex flex-col gap-2 w-28">
                        <div className="flex items-center justify-between text-[8px] font-black">
                            <span className="text-slate-600 uppercase">Processing Unit</span>
                            <span className={target.cpu > 80 ? 'text-red-500' : 'text-cyan-500'}>{target.cpu}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full transition-all duration-700 ${target.cpu > 80 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                              style={{ width: `${target.cpu}%` }} 
                            />
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-purple-500/80 transition-all duration-1000" 
                              style={{ width: `${target.ram}%` }} 
                            />
                        </div>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 hover:bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400/60 hover:text-cyan-400 transition-all active:scale-90">
                        <TerminalIcon size={14} />
                      </button>
                      <button className="p-2 hover:bg-slate-800 rounded border border-slate-800 text-slate-500 hover:text-slate-200 transition-all">
                        <Eye size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
