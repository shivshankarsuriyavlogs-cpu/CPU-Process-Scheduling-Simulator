import { Calculator, Clock, CheckSquare, Zap, Cpu } from 'lucide-react';

export default function FormulasSection() {
  const formulas = [
    {
      title: 'Completion Time (CT)',
      formula: 'CT = Instant process finishes execution',
      definition: 'The absolute clock time at which the process finishes its final CPU burst.',
      icon: CheckSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/60 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-900/60',
    },
    {
      title: 'Turnaround Time (TAT)',
      formula: 'TAT = Completion Time − Arrival Time',
      definition: 'The total elapsed duration spent by the process in the system from submission to completion.',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50/60 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-900/60',
    },
    {
      title: 'Waiting Time (WT)',
      formula: 'WT = Turnaround Time − Burst Time',
      definition: 'Total duration spent waiting in the ready queue before execution (TAT minus actual execution time).',
      icon: Calculator,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50/60 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900/60',
    },
    {
      title: 'Response Time (RT)',
      formula: 'RT = First Start Time − Arrival Time',
      definition: 'Time taken from submission/arrival until the process is allocated the CPU for the very first time.',
      icon: Zap,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900/60',
    },
    {
      title: 'CPU Utilization (%)',
      formula: 'Util = ((Total Time − Total Idle Time) / Total Time) × 100',
      definition: 'Percentage of total simulation time during which the processor was actively executing tasks.',
      icon: Cpu,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50/60 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-900/60',
    },
    {
      title: 'Throughput',
      formula: 'Throughput = Total Completed Processes / Total Schedule Time',
      definition: 'Number of processes successfully executed to completion per unit of simulation time.',
      icon: Calculator,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50/60 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900/60',
    },
  ];

  return (
    <div
      id="formulas"
      className="scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-6 transition-colors"
    >
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Calculator className="w-5 h-5" />
          </span>
          Educational Formula Reference
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Standard academic formulas specified in Operating Systems curricula (Silberschatz, Galvin &amp; Gagne).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formulas.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-5 rounded-xl border ${item.border} ${item.bg} space-y-3 flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className={`p-1.5 rounded-lg bg-white dark:bg-slate-900 ${item.color} shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 shadow-2xs">
                  {item.formula}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.definition}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
