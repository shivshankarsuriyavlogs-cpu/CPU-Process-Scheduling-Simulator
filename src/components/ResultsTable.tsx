import { useState } from 'react';
import {
  Download,
  Copy,
  Printer,
  Check,
  ArrowUpDown,
  Table as TableIcon,
} from 'lucide-react';
import { ProcessResult, SimulationResult } from '../types';
import { getProcessColor } from '../utils/colors';
import { exportToCSV } from '../utils/scheduler';

interface ResultsTableProps {
  simulation: SimulationResult;
}

type SortField = 'id' | 'arrivalTime' | 'burstTime' | 'priority' | 'completionTime' | 'turnaroundTime' | 'waitingTime' | 'responseTime';

export default function ResultsTable({ simulation }: ResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const { processResults, metrics, algorithmName } = simulation;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedResults = [...processResults].sort((a, b) => {
    let comp = 0;
    if (sortField === 'id') {
      comp = a.id.localeCompare(b.id, undefined, { numeric: true });
    } else {
      comp = a[sortField] - b[sortField];
    }
    return sortAsc ? comp : -comp;
  });

  const handleDownloadCSV = () => {
    const csvData = exportToCSV(simulation);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cpu_scheduling_${simulation.algorithm.toLowerCase()}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyResults = async () => {
    const headers = ['Process', 'AT', 'BT', 'Priority', 'CT', 'TAT', 'WT', 'RT'];
    const rows = sortedResults.map((p) =>
      [p.id, p.arrivalTime, p.burstTime, p.priority, p.completionTime, p.turnaroundTime, p.waitingTime, p.responseTime].join('\t')
    );
    const text = [
      `Algorithm: ${algorithmName}`,
      headers.join('\t'),
      ...rows,
      '',
      `Average Waiting Time: ${metrics.averageWaitingTime}`,
      `Average Turnaround Time: ${metrics.averageTurnaroundTime}`,
      `Average Response Time: ${metrics.averageResponseTime}`,
      `CPU Utilization: ${metrics.cpuUtilization}%`,
      `Throughput: ${metrics.throughput} proc/u`,
    ].join('\n');

    let success = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        // Fallback for iframe restrictions
      }
    }
    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        // ignore
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // ignore if restricted
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-5 transition-colors">
      {/* Header and export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Process Execution Results Table
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click column headers to sort. Detailed breakdown of arrival, burst, completion, turnaround, waiting, and response times.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="copy-results-btn"
            type="button"
            onClick={handleCopyResults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            title="Copy Table to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Results</span>
              </>
            )}
          </button>

          <button
            id="download-csv-btn"
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            title="Download CSV File"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Download CSV</span>
          </button>

          <button
            id="print-results-btn"
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            title="Print Results Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Process</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('arrivalTime')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Arrival (AT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('burstTime')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Burst (BT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('priority')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('completionTime')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Completion (CT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('turnaroundTime')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Turnaround (TAT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('waitingTime')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Waiting (WT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('responseTime')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Response (RT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs sm:text-sm">
            {sortedResults.map((p) => {
              const colorInfo = getProcessColor(p.id);
              return (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white shadow-2xs"
                      style={{ backgroundColor: colorInfo.hex }}
                    >
                      {p.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.arrivalTime}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.burstTime}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.priority}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{p.completionTime}</td>
                  <td className="px-4 py-3 font-semibold text-purple-700 dark:text-purple-400">{p.turnaroundTime}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700 dark:text-blue-400">{p.waitingTime}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{p.responseTime}</td>
                </tr>
              );
            })}
          </tbody>
          {/* Averages Row */}
          <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-mono text-xs sm:text-sm border-t-2 border-slate-300 dark:border-slate-700">
            <tr>
              <td colSpan={5} className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                Average Across {processResults.length} Processes:
              </td>
              <td className="px-4 py-3 font-bold text-purple-700 dark:text-purple-400">
                {metrics.averageTurnaroundTime.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-bold text-blue-700 dark:text-blue-400">
                {metrics.averageWaitingTime.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">
                {metrics.averageResponseTime.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
