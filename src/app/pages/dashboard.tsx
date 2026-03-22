import { Activity, Server, Zap, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatCard } from "../components/stat-card";
import { ThreatMap } from "../components/threat-map";
import { NetworkGraph } from "../components/network-graph";
import { VulnerabilityScanner } from "../components/vulnerability-scanner";
import { ThreatFeed } from "../components/threat-feed";
import { TargetTable } from "../components/target-table";

const generateSparkline = (length: number = 20, trend: 'up' | 'down' | 'random' = 'random') => {
  let values = [];
  let base = 50;
  for (let i = 0; i < length; i++) {
    if (trend === 'up') {
      base += Math.random() * 5;
    } else if (trend === 'down') {
      base -= Math.random() * 5;
    } else {
      base += (Math.random() - 0.5) * 10;
    }
    values.push(Math.max(0, Math.min(100, base)));
  }
  return values;
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Agents"
          value="247"
          icon={Server}
          trend="up"
          trendValue="+12 today"
          sparklineData={generateSparkline(20, 'up')}
          color="var(--c2-cyan)"
        />
        <StatCard
          title="Active Tasks"
          value="18"
          icon={Zap}
          trend="neutral"
          trendValue="Running"
          sparklineData={generateSparkline(20, 'random')}
          color="var(--c2-toxic)"
        />
        <StatCard
          title="Success Rate"
          value="98.2%"
          icon={CheckCircle2}
          trend="up"
          trendValue="+2.1%"
          sparklineData={generateSparkline(20, 'up')}
          color="var(--c2-toxic)"
        />
        <StatCard
          title="Alerts"
          value="3"
          icon={AlertTriangle}
          trend="down"
          trendValue="-5 today"
          sparklineData={generateSparkline(20, 'down')}
          color="var(--c2-crimson)"
        />
      </div>

      {/* Threat Intelligence Map */}
      <div className="h-[500px]">
        <ThreatMap />
      </div>

      {/* Network Graph and Vulnerability Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-[400px]">
          <NetworkGraph />
        </div>
        <VulnerabilityScanner />
      </div>

      {/* Threat Feed and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-[500px]">
          <ThreatFeed />
        </div>
        
        <div className="space-y-4">
          <div 
            className="rounded-lg p-4 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(22, 27, 34, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4" style={{ color: 'var(--c2-cyan)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--c2-cyan)' }}>
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { time: '14:23:45', action: 'Agent TGT-4F2A checked in', status: 'success' },
                { time: '14:22:18', action: 'Task execution completed on TGT-8B91', status: 'success' },
                { time: '14:20:03', action: 'Payload delivered to TGT-C3E7', status: 'success' },
                { time: '14:18:56', action: 'Connection timeout on TGT-D947', status: 'error' },
                { time: '14:15:22', action: 'Data exfiltration started from TGT-7E2F', status: 'warning' },
              ].map((activity, idx) => {
                const statusColor = 
                  activity.status === 'success' ? 'var(--c2-toxic)' :
                  activity.status === 'error' ? 'var(--c2-crimson)' :
                  '#FFA500';

                return (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-gray-500 font-mono text-xs w-20 flex-shrink-0">
                      {activity.time}
                    </span>
                    <div 
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: statusColor }}
                    />
                    <span className="text-gray-300 flex-1">{activity.action}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div 
            className="rounded-lg p-4 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(22, 27, 34, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" style={{ color: 'var(--c2-toxic)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--c2-toxic)' }}>
                System Status
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'C2 Server', status: 'Operational', uptime: '99.98%' },
                { label: 'Database', status: 'Operational', uptime: '99.95%' },
                { label: 'Payload Server', status: 'Operational', uptime: '99.99%' },
                { label: 'Exfil Nodes', status: 'Degraded', uptime: '87.21%' },
              ].map((system, idx) => {
                const isHealthy = system.uptime.startsWith('99');
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: isHealthy ? 'var(--c2-toxic)' : 'var(--c2-crimson)',
                        }}
                      />
                      <span className="text-sm text-gray-300">{system.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span 
                        className="text-xs font-semibold"
                        style={{ color: isHealthy ? 'var(--c2-toxic)' : 'var(--c2-crimson)' }}
                      >
                        {system.status}
                      </span>
                      <span className="text-xs text-gray-500 font-mono w-16 text-right">
                        {system.uptime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Target Table */}
      <TargetTable />
    </div>
  );
}