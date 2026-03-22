import { useEffect, useState } from "react";

interface Agent {
  id: string;
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'critical';
}

const mockAgents: Agent[] = [
  { id: 'AGT-001', lat: 40.7128, lng: -74.0060, status: 'online' },   // New York
  { id: 'AGT-002', lat: 51.5074, lng: -0.1278, status: 'online' },    // London
  { id: 'AGT-003', lat: 35.6762, lng: 139.6503, status: 'online' },   // Tokyo
  { id: 'AGT-004', lat: -33.8688, lng: 151.2093, status: 'critical' }, // Sydney
  { id: 'AGT-005', lat: 55.7558, lng: 37.6173, status: 'online' },    // Moscow
  { id: 'AGT-006', lat: 37.7749, lng: -122.4194, status: 'online' },  // San Francisco
  { id: 'AGT-007', lat: 52.5200, lng: 13.4050, status: 'online' },    // Berlin
  { id: 'AGT-008', lat: 1.3521, lng: 103.8198, status: 'offline' },   // Singapore
  { id: 'AGT-009', lat: -23.5505, lng: -46.6333, status: 'online' },  // São Paulo
  { id: 'AGT-010', lat: 19.4326, lng: -99.1332, status: 'online' },   // Mexico City
];

export function WorldMap() {
  const [pulseStates, setPulseStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newStates: { [key: string]: boolean } = {};
      mockAgents.forEach(agent => {
        newStates[agent.id] = Math.random() > 0.5;
      });
      setPulseStates(newStates);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latToY = (lat: number) => {
    return ((90 - lat) / 180) * 100;
  };

  const lngToX = (lng: number) => {
    return ((lng + 180) / 360) * 100;
  };

  const getAgentColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--c2-cyan)';
      case 'critical': return 'var(--c2-crimson)';
      case 'offline': return '#666';
      default: return 'var(--c2-cyan)';
    }
  };

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--c2-darker-surface)',
        border: '1px solid rgba(0, 240, 255, 0.1)',
      }}
    >
      {/* Grid Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="var(--c2-cyan)" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Latitude lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={`lat-${y}`}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="var(--c2-cyan)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        
        {/* Longitude lines */}
        {[0, 25, 50, 75, 100].map((x) => (
          <line
            key={`lng-${x}`}
            x1={`${x}%`}
            y1="0"
            x2={`${x}%`}
            y2="100%"
            stroke="var(--c2-cyan)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
      </svg>

      {/* World Outline (Simplified) */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          <path
            d="M 200,150 L 250,130 L 300,140 L 350,120 L 400,130 L 450,110 L 500,120 L 550,100 L 600,110 L 650,90 L 700,100 L 750,120 L 800,130"
            stroke="var(--c2-cyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 150,200 L 200,180 L 250,190 L 300,170 L 350,180 L 400,160 L 450,170 L 500,150 L 550,160 L 600,140"
            stroke="var(--c2-cyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Agents */}
      {mockAgents.map((agent) => {
        const x = lngToX(agent.lng);
        const y = latToY(agent.lat);
        const isPulsing = pulseStates[agent.id];

        return (
          <div
            key={agent.id}
            className="absolute group cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pulse Ring */}
            {isPulsing && agent.status === 'online' && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: getAgentColor(agent.status),
                  opacity: 0.3,
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                }}
              />
            )}
            
            {/* Agent Dot */}
            <div
              className="relative w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: getAgentColor(agent.status),
                boxShadow: `0 0 12px ${getAgentColor(agent.status)}`,
              }}
            />

            {/* Tooltip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono"
              style={{
                backgroundColor: 'var(--c2-dark-surface)',
                border: `1px solid ${getAgentColor(agent.status)}`,
                color: getAgentColor(agent.status),
              }}
            >
              {agent.id}
            </div>
          </div>
        );
      })}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {mockAgents.slice(0, 5).map((agent, idx) => {
          if (idx === mockAgents.length - 1) return null;
          const nextAgent = mockAgents[idx + 1];
          const x1 = lngToX(agent.lng);
          const y1 = latToY(agent.lat);
          const x2 = lngToX(nextAgent.lng);
          const y2 = latToY(nextAgent.lat);

          return (
            <line
              key={`line-${idx}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="var(--c2-cyan)"
              strokeWidth="1"
              opacity="0.2"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* Overlay Label */}
      <div 
        className="absolute top-4 left-4 px-3 py-1.5 rounded font-mono text-xs"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          color: 'var(--c2-cyan)',
        }}
      >
        GLOBAL AGENT DISTRIBUTION
      </div>
    </div>
  );
}
