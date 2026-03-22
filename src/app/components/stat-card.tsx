import { LucideIcon } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  sparklineData?: number[];
  color?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend = 'neutral',
  trendValue,
  sparklineData,
  color = 'var(--c2-cyan)'
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'var(--c2-toxic)';
      case 'down': return 'var(--c2-crimson)';
      default: return '#666';
    }
  };

  const chartData = sparklineData?.map((value, index) => ({ value, index })) || [];

  return (
    <div 
      className="rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: 'rgba(22, 27, 34, 0.5)',
        border: '1px solid rgba(0, 240, 255, 0.1)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {title}
          </div>
          <div 
            className="text-2xl font-bold font-mono"
            style={{ color }}
          >
            {value}
          </div>
          {trendValue && (
            <div 
              className="text-xs mt-1 font-semibold"
              style={{ color: getTrendColor() }}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </div>
          )}
        </div>
        <div 
          className="p-2 rounded-lg"
          style={{
            backgroundColor: `${color}15`,
            border: `1px solid ${color}40`,
          }}
        >
          <Icon 
            className="w-5 h-5"
            style={{ 
              color,
              filter: `drop-shadow(0 0 4px ${color}40)`
            }}
          />
        </div>
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="h-12 -mx-2 -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
