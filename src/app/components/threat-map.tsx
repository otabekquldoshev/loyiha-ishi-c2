import { useEffect, useState, useMemo } from "react";
import { AlertTriangle, Shield, Zap } from "lucide-react";

interface ThreatNode {
  id: string;
  lat: number;
  lng: number;
  type: "attack" | "defense" | "compromised";
  severity: "low" | "medium" | "high" | "critical";
  label: string;
}

interface Connection {
  from: number;
  to: number;
  type: "attack" | "data" | "command";
}

const threatNodes: ThreatNode[] = [
  { id: "NODE-001", lat: 40.7128, lng: -74.006, type: "defense", severity: "low", label: "NYC-HQ" },
  { id: "NODE-002", lat: 51.5074, lng: -0.1278, type: "compromised", severity: "critical", label: "LON-TARGET" },
  { id: "NODE-003", lat: 35.6762, lng: 139.6503, type: "attack", severity: "high", label: "TYO-THREAT" },
  { id: "NODE-004", lat: -33.8688, lng: 151.2093, type: "defense", severity: "medium", label: "SYD-NODE" },
  { id: "NODE-005", lat: 55.7558, lng: 37.6173, type: "attack", severity: "critical", label: "MOS-ATTACK" },
  { id: "NODE-006", lat: 37.7749, lng: -122.4194, type: "compromised", severity: "high", label: "SF-BREACH" },
  { id: "NODE-007", lat: 1.3521, lng: 103.8198, type: "defense", severity: "low", label: "SIN-SEC" },
  { id: "NODE-008", lat: 25.2048, lng: 55.2708, type: "attack", severity: "medium", label: "DXB-SCAN" },
];

const connections: Connection[] = [
  { from: 2, to: 1, type: "attack" },
  { from: 4, to: 5, type: "attack" },
  { from: 0, to: 3, type: "command" },
  { from: 2, to: 5, type: "data" },
  { from: 7, to: 6, type: "attack" },
];

export function ThreatMap() {
  const [active, setActive] = useState<Set<number>>(new Set());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const s = new Set<number>();
      connections.forEach((_, i) => {
        if (Math.random() > 0.45) s.add(i);
      });
      setActive(s);
      setTime(new Date());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const latToY = (lat: number) => ((90 - lat) / 180) * 100;
  const lngToX = (lng: number) => ((lng + 180) / 360) * 100;

  const getColor = (type: string) => {
    if (type === "attack") return "#ff3b3b";
    if (type === "compromised") return "#ff8800";
    return "#00f0ff";
  };

  const getGlow = (severity: string) => {
    switch (severity) {
      case "critical":
        return "0 0 30px #ff3b3b, 0 0 60px #ff3b3b66";
      case "high":
        return "0 0 20px #ff8800";
      case "medium":
        return "0 0 12px #ffaa00";
      default:
        return "0 0 10px #00f0ff";
    }
  };

  const curvePath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const stats = useMemo(() => {
    return {
      total: threatNodes.length,
      active: active.size,
      critical: threatNodes.filter(n => n.severity === "critical").length,
    };
  }, [active]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-xl">

      {/* WORLD MAP */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* NOISE */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* GRID LAYER 1 */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#00f0ff22_1px,transparent_1px),linear-gradient(90deg,#00f0ff22_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* GRID LAYER 2 */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(#ff3b3b22_1px,transparent_1px),linear-gradient(90deg,#ff3b3b22_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* CONNECTIONS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((c, i) => {
          const from = threatNodes[c.from];
          const to = threatNodes[c.to];

          const x1 = lngToX(from.lng);
          const y1 = latToY(from.lat);
          const x2 = lngToX(to.lng);
          const y2 = latToY(to.lat);

          const path = curvePath(x1, y1, x2, y2);
          const isActive = active.has(i);

          return (
            <g key={i}>
              <path
                d={path}
                stroke="#ff3b3b"
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.15}
                fill="none"
                strokeDasharray="8 4"
              />

              {isActive &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <circle key={idx} r="2.5" fill="#ff3b3b">
                    <animateMotion
                      dur={`${1.2 + idx * 0.4}s`}
                      repeatCount="indefinite"
                      path={path}
                    />
                  </circle>
                ))}
            </g>
          );
        })}
      </svg>

      {/* NODES */}
      {threatNodes.map((node) => {
        const x = lngToX(node.lng);
        const y = latToY(node.lat);

        return (
          <div
            key={node.id}
            className="absolute group"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* pulse */}
            <div
              className="absolute w-14 h-14 rounded-full animate-ping"
              style={{
                background: getColor(node.type),
                opacity: 0.2,
              }}
            />

            {/* core */}
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: getColor(node.type),
                boxShadow: getGlow(node.severity),
              }}
            >
              {node.type === "attack" && <Zap size={12} />}
              {node.type === "compromised" && <AlertTriangle size={12} />}
              {node.type === "defense" && <Shield size={12} />}
            </div>

            {/* tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition text-xs text-white bg-black/80 px-2 py-1 rounded">
              {node.id} | {node.label}
            </div>
          </div>
        );
      })}

      {/* RADAR */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-spinSlow bg-[conic-gradient(from_0deg,#00f0ff00,#00f0ff22,#00f0ff00)]" />
      </div>

      {/* SCAN LINE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[2px] w-full bg-cyan-400 opacity-40 animate-scan" />
      </div>

      {/* HEADER */}
      <div className="absolute top-4 left-4 text-cyan-400 font-mono text-xs">
        GLOBAL CYBER THREAT MAP
      </div>

      {/* TIME */}
      <div className="absolute top-4 right-4 text-red-400 font-mono text-xs">
        {time.toLocaleTimeString()}
      </div>

      {/* STATS PANEL */}
      <div className="absolute bottom-4 right-4 text-xs text-white bg-black/70 px-4 py-3 rounded-lg backdrop-blur">
        <div>Total Nodes: {stats.total}</div>
        <div>Active Attacks: {stats.active}</div>
        <div>Critical: {stats.critical}</div>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spinSlow {
          animation: spinSlow 25s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
