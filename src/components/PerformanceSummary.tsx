import { Clock, Timer, Zap, Gauge, ArrowRightLeft } from 'lucide-react';
import { SimulationMetrics } from '../types';

interface PerformanceSummaryProps {
  metrics: SimulationMetrics;
  processCount: number;
}

export default function PerformanceSummary({
  metrics,
  processCount,
}: PerformanceSummaryProps) {
  const cards = [
    {
      title: 'Average Waiting Time',
      acronym: 'Avg WT',
      value: metrics.averageWaitingTime.toFixed(2),
      unit: 'units',
      formula: 'Σ WT / N',
      description: 'Average time processes spent waiting in ready queue',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-900/60',
    },
    {
      title: 'Average Turnaround Time',
      acronym: 'Avg TAT',
      value: metrics.averageTurnaroundTime.toFixed(2),
      unit: 'units',
      formula: 'Σ TAT / N',
      description: 'Average time between submission and completion',
      icon: Timer,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-900/60',
    },
    {
      title: 'Average Response Time',
      acronym: 'Avg RT',
      value: metrics.averageResponseTime.toFixed(2),
      unit: 'units',
      formula: 'Σ RT / N',
      description: 'Average time from arrival to first CPU allocation',
      icon: Zap,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900/60',
    },
    {
      title: 'CPU Utilization',
      acronym: 'Util',
      value: `${metrics.cpuUtilization.toFixed(2)}%`,
      unit: '',
      formula: 'Busy / Total Time',
      description: `${(metrics.totalTime - metrics.totalIdleTime)}u busy of ${metrics.totalTime}u total`,
      icon: Gauge,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900/60',
    },
    {
      title: 'Throughput',
      acronym: 'TP',
      value: metrics.throughput.toFixed(4),
      unit: 'proc / unit',
      formula: 'N / Total Time',
      description: `${processCount} processes completed in ${metrics.totalTime} units`,
      icon: ArrowRightLeft,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-900/60',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Performance Summary
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dynamically computed metrics from the simulated schedule
          </p>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Total Schedule: <strong>{metrics.totalTime}</strong> units | Idle: <strong>{metrics.totalIdleTime}</strong> units
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-4 rounded-xl border ${card.border} ${card.bg} transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {card.title}
                </span>
                <span className={`p-1.5 rounded-lg ${card.color} bg-white dark:bg-slate-900 shadow-xs`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-black tracking-tight font-mono ${card.color}`}>
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {card.unit}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500">
                  {card.formula}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
