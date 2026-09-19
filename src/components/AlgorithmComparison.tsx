import { useState } from 'react';
import { BarChart3, Layers, Info } from 'lucide-react';
import { ComparisonItem } from '../types';

interface AlgorithmComparisonProps {
  comparisonData: ComparisonItem[];
  timeQuantum: number;
}

type MetricType = 'avgWT' | 'avgTAT' | 'avgRT' | 'cpuUtilization';

export default function AlgorithmComparison({
  comparisonData,
  timeQuantum,
}: AlgorithmComparisonProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('avgWT');

  const metricLabels: Record<MetricType, { title: string; unit: string; color: string; hex: string }> = {
    avgWT: { title: 'Average Waiting Time', unit: 'units', color: 'bg-blue-600', hex: '#2563eb' },
    avgTAT: { title: 'Average Turnaround Time', unit: 'units', color: 'bg-purple-600', hex: '#9333ea' },
    avgRT: { title: 'Average Response Time', unit: 'units', color: 'bg-emerald-600', hex: '#059669' },
    cpuUtilization: { title: 'CPU Utilization', unit: '%', color: 'bg-amber-600', hex: '#d97706' },
  };

  const currentMetricInfo = metricLabels[selectedMetric];

  // Calculate max for dynamic SVG bar chart scaling
  const metricValues = comparisonData.map((d) => d[selectedMetric]);
  const maxValue = Math.max(...metricValues, 1);

  return (
    <div
      id="comparison"
      className="scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-6 transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </span>
            Algorithm Performance Comparison
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simultaneous comparative execution across all 6 scheduling algorithms using the identical workload.
          </p>
        </div>

        {/* Metric Selector for Charts */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto flex-wrap">
          {(['avgWT', 'avgTAT', 'avgRT', 'cpuUtilization'] as MetricType[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMetric(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedMetric === m
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m === 'avgWT' ? 'Avg WT' : m === 'avgTAT' ? 'Avg TAT' : m === 'avgRT' ? 'Avg RT' : 'CPU Util'}
            </button>
          ))}
        </div>
      </div>

      {/* Graphical Bar Chart Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Visual Comparison: {currentMetricInfo.title} ({currentMetricInfo.unit})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Round Robin Quantum: {timeQuantum}
          </span>
        </div>

        {/* Responsive Bar Chart */}
        <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          {comparisonData.map((item) => {
            const val = item[selectedMetric];
            const barWidthPercent = Math.max((val / maxValue) * 100, 2);

            return (
              <div key={item.algorithm} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {item.name}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      ({item.isPreemptive ? 'Preemptive' : 'Non-Preemptive'})
                    </span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {val.toFixed(2)} {currentMetricInfo.unit}
                  </span>
                </div>

                {/* Bar */}
                <div className="h-6 w-full rounded-lg bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden flex">
                  <div
                    style={{ width: `${barWidthPercent}%` }}
                    className={`h-full ${currentMetricInfo.color} transition-all duration-500 flex items-center justify-end pr-2 text-white font-mono text-[11px] font-bold`}
                  >
                    {barWidthPercent > 15 ? `${val.toFixed(2)}` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Tabular Algorithm Evaluation Metrics
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Avg WT</th>
                <th className="px-4 py-3">Avg TAT</th>
                <th className="px-4 py-3">Avg RT</th>
                <th className="px-4 py-3">CPU Utilization</th>
                <th className="px-4 py-3">Throughput</th>
                <th className="px-4 py-3">Total Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {comparisonData.map((item) => (
                <tr
                  key={item.algorithm}
                  className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.isPreemptive
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.isPreemptive ? 'Preemptive' : 'Non-Preemptive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                    {item.avgWT.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400">
                    {item.avgTAT.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.avgRT.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-600 dark:text-amber-400">
                    {item.cpuUtilization.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {item.throughput.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {item.totalTime}u
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Note: No bias / no arbitrary "best" */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Operating Systems Concept Note:</strong> In operating systems design, no single CPU scheduling algorithm is universally labeled &quot;best&quot;. While SRTF frequently achieves minimal average waiting time for batch systems, it carries preemption context-switch overhead and starvation risks for long processes. Round Robin excels in time-sharing interactivity, whereas FCFS offers minimal implementation overhead.
        </p>
      </div>
    </div>
  );
}
