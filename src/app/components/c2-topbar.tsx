import { Activity, Wifi, Zap, Power } from "lucide-react";
import { useState, useEffect } from "react";

export function C2TopBar() {
  const [time, setTime] = useState(new Date());
  const [latency, setLatency] = useState(12);
  const [showKillConfirm, setShowKillConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const latencyTimer = setInterval(() => {
      setLatency(Math.floor(Math.random() * 20) + 8);
    }, 3000);
    return () => {
      clearInterval(timer);
      clearInterval(latencyTimer);
    };
  }, []);

  const stats = [
    { 
      icon: Activity, 
      label: "Agents Online", 
      value: "247", 
      color: "var(--c2-toxic)",
      glow: "var(--c2-toxic-glow)"
    },
    { 
      icon: Zap, 
      label: "Active Tasks", 
      value: "18", 
      color: "var(--c2-cyan)",
      glow: "var(--c2-cyan-glow)"
    },
    { 
      icon: Wifi, 
      label: "Network Latency", 
      value: `${latency}ms`, 
      color: latency < 15 ? "var(--c2-toxic)" : "var(--c2-cyan)",
      glow: latency < 15 ? "var(--c2-toxic-glow)" : "var(--c2-cyan-glow)"
    },
  ];

  return (
    <div 
      className="h-16 border-b flex items-center justify-between px-6 relative"
      style={{ 
        backgroundColor: 'var(--c2-dark-surface)',
        borderColor: 'rgba(0, 240, 255, 0.1)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* Stats */}
      <div className="flex items-center gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-3 group">
              <div 
                className="p-2 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${stat.color}40`,
                  boxShadow: `0 0 10px ${stat.glow}`,
                }}
              >
                <Icon 
                  className="w-4 h-4"
                  style={{ 
                    color: stat.color,
                    filter: `drop-shadow(0 0 4px ${stat.glow})`
                  }}
                />
              </div>
              <div>
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div 
                  className="text-sm font-semibold font-mono"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Time */}
        <div className="text-right">
          <div className="text-xs text-gray-400">SYSTEM TIME</div>
          <div 
            className="text-sm font-mono font-semibold"
            style={{ color: 'var(--c2-cyan)' }}
          >
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>

        {/* Kill Switch */}
        <div className="relative">
          <button
            onClick={() => setShowKillConfirm(!showKillConfirm)}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 75, 75, 0.1)',
              border: '1px solid var(--c2-crimson)',
              color: 'var(--c2-crimson)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 20px var(--c2-crimson-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Power className="w-4 h-4" />
            KILL SWITCH
          </button>

          {showKillConfirm && (
            <div 
              className="absolute top-full right-0 mt-2 p-3 rounded-lg backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2"
              style={{
                backgroundColor: 'rgba(13, 17, 23, 0.95)',
                border: '1px solid var(--c2-crimson)',
                boxShadow: '0 0 30px var(--c2-crimson-glow)',
                minWidth: '250px',
              }}
            >
              <div className="text-xs text-gray-400 mb-2">
                Confirm Emergency Shutdown?
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 75, 75, 0.2)',
                    border: '1px solid var(--c2-crimson)',
                    color: 'var(--c2-crimson)',
                  }}
                  onClick={() => setShowKillConfirm(false)}
                >
                  Confirm
                </button>
                <button
                  className="flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid var(--c2-cyan)',
                    color: 'var(--c2-cyan)',
                  }}
                  onClick={() => setShowKillConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}