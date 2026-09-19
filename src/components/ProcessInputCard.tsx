import { useState } from 'react';
import {
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Play,
  Layers,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowUpDown,
  Eraser,
} from 'lucide-react';
import { ProcessInput, AlgorithmType, PriorityDirection } from '../types';
import { PRESET_EXAMPLES } from '../utils/colors';

interface ProcessInputCardProps {
  processes: ProcessInput[];
  algorithm: AlgorithmType;
  timeQuantum: number;
  priorityDirection: PriorityDirection;
  onUpdateProcesses: (processes: ProcessInput[]) => void;
  onSelectAlgorithm: (alg: AlgorithmType) => void;
  onChangeTimeQuantum: (val: number) => void;
  onChangePriorityDirection: (dir: PriorityDirection) => void;
  onRunSimulation: () => void;
  onCompareAll: () => void;
  onReset: () => void;
  onClearResults: () => void;
  onLoadPreset: (index: number) => void;
  validationError: string | null;
}

export default function ProcessInputCard({
  processes,
  algorithm,
  timeQuantum,
  priorityDirection,
  onUpdateProcesses,
  onSelectAlgorithm,
  onChangeTimeQuantum,
  onChangePriorityDirection,
  onRunSimulation,
  onCompareAll,
  onReset,
  onClearResults,
  onLoadPreset,
  validationError,
}: ProcessInputCardProps) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);

  // Add process with next sequential ID (e.g. P1, P2...)
  const handleAddProcess = () => {
    let nextNum = 1;
    const existingNums = processes
      .map((p) => {
        const match = p.id.match(/^P(\d+)$/i);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => n !== null);

    if (existingNums.length > 0) {
      nextNum = Math.max(...existingNums) + 1;
    } else {
      nextNum = processes.length + 1;
    }

    const newProcess: ProcessInput = {
      id: `P${nextNum}`,
      arrivalTime: 0,
      burstTime: 4,
      priority: 1,
    };
    onUpdateProcesses([...processes, newProcess]);
  };

  const handleRemoveProcess = (index: number) => {
    if (processes.length <= 1) {
      return;
    }
    const updated = processes.filter((_, i) => i !== index);
    onUpdateProcesses(updated);
  };

  const handleFieldChange = (
    index: number,
    field: keyof ProcessInput,
    value: string,
  ) => {
    const updated = processes.map((p, i) => {
      if (i === index) {
        if (field === 'id') {
          return { ...p, id: value };
        } else {
          if (value === '') {
            return { ...p, [field]: '' as unknown as number };
          }
          const num = Number(value);
          return { ...p, [field]: isNaN(num) ? 0 : num };
        }
      }
      return p;
    });
    onUpdateProcesses(updated);
  };

  const handleFieldBlur = (index: number, field: keyof ProcessInput) => {
    const updated = processes.map((p, i) => {
      if (i === index) {
        if (field === 'arrivalTime') {
          const val = Number(p.arrivalTime);
          return { ...p, arrivalTime: isNaN(val) || val < 0 ? 0 : val };
        }
        if (field === 'burstTime') {
          const val = Number(p.burstTime);
          return { ...p, burstTime: isNaN(val) || val <= 0 ? 1 : val };
        }
        if (field === 'priority') {
          const val = Number(p.priority);
          return { ...p, priority: isNaN(val) ? 1 : val };
        }
      }
      return p;
    });
    onUpdateProcesses(updated);
  };

  const handleClearAll = () => {
    onUpdateProcesses([
      { id: 'P1', arrivalTime: 0, burstTime: 1, priority: 1 },
    ]);
    onClearResults();
  };

  const handlePresetSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedPresetIndex(idx);
    onLoadPreset(idx);
  };

  const algorithmOptions: { value: AlgorithmType; label: string; tag: string }[] = [
    { value: 'FCFS', label: 'FCFS — First Come First Serve', tag: 'Non-Preemptive' },
    { value: 'SJF', label: 'SJF — Shortest Job First', tag: 'Non-Preemptive' },
    { value: 'SRTF', label: 'SRTF — Shortest Remaining Time First', tag: 'Preemptive' },
    { value: 'PRIORITY_NP', label: 'Priority Scheduling', tag: 'Non-Preemptive' },
    { value: 'PRIORITY_P', label: 'Priority Scheduling', tag: 'Preemptive' },
    { value: 'ROUND_ROBIN', label: 'Round Robin (RR)', tag: 'Preemptive' },
  ];

  const isPriorityAlg = algorithm === 'PRIORITY_NP' || algorithm === 'PRIORITY_P';
  const isRoundRobin = algorithm === 'ROUND_ROBIN';

  return (
    <div
      id="simulator"
      className="scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-6 transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </span>
            Simulation Configuration & Process Input
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure arrival times, burst requirements, and scheduling policies.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="preset-selector" className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Example Workload:
          </label>
          <select
            id="preset-selector"
            value={selectedPresetIndex}
            onChange={handlePresetSelectChange}
            className="text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {PRESET_EXAMPLES.map((preset, idx) => (
              <option key={preset.name} value={idx}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Algorithm Selection Grid */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          Select Scheduling Algorithm:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {algorithmOptions.map((opt) => {
            const isSelected = algorithm === opt.value;
            return (
              <button
                key={opt.value}
                id={`alg-select-${opt.value}`}
                type="button"
                onClick={() => onSelectAlgorithm(opt.value)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all text-sm relative cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-200 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">{opt.label}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      opt.tag === 'Preemptive'
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {opt.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Parameters: Time Quantum & Priority Direction */}
      {(isRoundRobin || isPriorityAlg) && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-5 transition-all">
          {/* Time Quantum */}
          {isRoundRobin && (
            <div className="space-y-1.5">
              <label
                htmlFor="time-quantum-input"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Time Quantum (time slice):
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="time-quantum-input"
                  type="number"
                  min="1"
                  step="1"
                  value={timeQuantum}
                  onChange={(e) => onChangeTimeQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-24 px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Each process executes for at most {timeQuantum} unit(s) before yielding to ready queue.
                </span>
              </div>
            </div>
          )}

          {/* Priority Direction */}
          {isPriorityAlg && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-500" />
                Priority Direction Convention:
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  id="priority-lower-higher"
                  onClick={() => onChangePriorityDirection('LOWER_HIGHER')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    priorityDirection === 'LOWER_HIGHER'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Lower Number = Higher Priority (Standard: 1 &gt; 2 &gt; 3)
                </button>
                <button
                  type="button"
                  id="priority-higher-higher"
                  onClick={() => onChangePriorityDirection('HIGHER_HIGHER')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    priorityDirection === 'HIGHER_HIGHER'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Higher Number = Higher Priority (Alternative: 3 &gt; 2 &gt; 1)
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {priorityDirection === 'LOWER_HIGHER'
                  ? 'Standard UNIX convention: Priority 1 executes before Priority 2.'
                  : 'Alternative convention: Higher integer values represent higher dispatch urgency.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Process Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Process List ({processes.length} Processes):
          </label>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            AT: Arrival Time | BT: Burst Time | Priority
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-28">Process ID</th>
                <th className="px-4 py-3">Arrival Time (AT)</th>
                <th className="px-4 py-3">Burst Time (BT)</th>
                <th className="px-4 py-3">
                  Priority
                  {isPriorityAlg && (
                    <span className="ml-1 text-[10px] font-normal text-blue-600 dark:text-blue-400">
                      ({priorityDirection === 'LOWER_HIGHER' ? '1=highest' : 'high=highest'})
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {processes.map((process, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Process ID */}
                  <td className="px-4 py-2.5">
                    <input
                      id={`input-process-id-${index}`}
                      type="text"
                      value={process.id}
                      onChange={(e) => handleFieldChange(index, 'id', e.target.value)}
                      className="w-20 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Arrival Time */}
                  <td className="px-4 py-2.5">
                    <input
                      id={`input-process-at-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      value={process.arrivalTime}
                      onChange={(e) => handleFieldChange(index, 'arrivalTime', e.target.value)}
                      onBlur={() => handleFieldBlur(index, 'arrivalTime')}
                      className="w-full max-w-[140px] px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Burst Time */}
                  <td className="px-4 py-2.5">
                    <input
                      id={`input-process-bt-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      value={process.burstTime}
                      onChange={(e) => handleFieldChange(index, 'burstTime', e.target.value)}
                      onBlur={() => handleFieldBlur(index, 'burstTime')}
                      className="w-full max-w-[140px] px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-2.5">
                    <input
                      id={`input-process-priority-${index}`}
                      type="number"
                      step="1"
                      value={process.priority}
                      onChange={(e) => handleFieldChange(index, 'priority', e.target.value)}
                      onBlur={() => handleFieldBlur(index, 'priority')}
                      className="w-full max-w-[140px] px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Delete button */}
                  <td className="px-4 py-2.5 text-center">
                    <button
                      id={`remove-process-${index}-btn`}
                      type="button"
                      disabled={processes.length <= 1}
                      onClick={() => handleRemoveProcess(index)}
                      className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ${
                        processes.length <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      title={processes.length <= 1 ? 'At least one process required' : 'Remove Process'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Row manipulation buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              id="add-process-btn"
              type="button"
              onClick={handleAddProcess}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Process
            </button>

            <button
              id="clear-all-processes-btn"
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 text-xs font-medium transition-colors cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>

          <button
            id="load-example-btn"
            type="button"
            onClick={() => onLoadPreset(0)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Default Example
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <strong className="font-semibold block">Input Validation Notice:</strong>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      {/* Primary Action Controls */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="run-simulation-btn"
            type="button"
            onClick={onRunSimulation}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Run Simulation
          </button>

          <button
            id="compare-all-algorithms-btn"
            type="button"
            onClick={onCompareAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            Compare All Algorithms
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="clear-results-btn"
            type="button"
            onClick={onClearResults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Clear current simulation results"
          >
            <Eraser className="w-4 h-4" />
            Clear Results
          </button>

          <button
            id="reset-inputs-btn"
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Reset to default example"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
