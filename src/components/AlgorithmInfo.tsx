import { BookOpen, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export default function AlgorithmInfo() {
  const algorithms = [
    {
      name: 'FCFS',
      fullName: 'First Come First Serve',
      type: 'Non-Preemptive',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      principle:
        'Processes are dispatched in strict FIFO order according to their arrival time. Once a process gets the CPU, it runs uninterrupted until completion or I/O request.',
      characteristics: [
        'Simplest CPU scheduling algorithm to conceptualize and implement.',
        'Uses a standard FIFO (First-In-First-Out) queue structure.',
        'Susceptible to the Convoy Effect: short processes get trapped waiting behind a long burst process.',
        'Average Waiting Time is often significantly high if long processes arrive first.',
      ],
      example:
        'If P1 (BT=20) arrives at t=0 and P2 (BT=2) arrives at t=1, P2 waits 19 units until P1 finishes at t=20.',
    },
    {
      name: 'SJF',
      fullName: 'Shortest Job First (Non-Preemptive)',
      type: 'Non-Preemptive',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      principle:
        'When the CPU becomes available, it selects the process from the ready queue that has the smallest burst time. Once assigned, the process runs to completion without interruption.',
      characteristics: [
        'Provably optimal for minimizing average waiting time among non-preemptive algorithms.',
        'Requires prior knowledge or prediction (exponential averaging) of CPU burst durations.',
        'Longer burst processes can suffer starvation if shorter jobs keep arriving.',
        'Tie-breakers typically default to earlier arrival time, then process ID.',
      ],
      example:
        'At t=2, if P1 (BT=6) and P2 (BT=3) are ready, SJF selects P2 first, reducing overall queue waiting.',
    },
    {
      name: 'SRTF',
      fullName: 'Shortest Remaining Time First',
      type: 'Preemptive',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      principle:
        'The preemptive version of SJF. At every instant (or on any new process arrival), the CPU is allocated to the process with the shortest remaining burst time. If an incoming job has a remaining time shorter than the currently running job, the current job is preempted.',
      characteristics: [
        'Achieves minimum average waiting time among all scheduling policies for given workloads.',
        'Incurs higher context-switch overhead due to frequent preemptions.',
        'High starvation risk for CPU-intensive processes under continuous short-job arrival streams.',
        'Response time is excellent for short interactive requests.',
      ],
      example:
        'P1 has 5 units remaining when P2 arrives with BT=2. P1 is immediately preempted and returned to ready queue.',
    },
    {
      name: 'Priority Scheduling',
      fullName: 'Priority Scheduling (Preemptive & Non-Preemptive)',
      type: 'Preemptive / Non-Preemptive',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      principle:
        'Each process is assigned a priority rank. The CPU is allocated to the ready process with the highest priority. In Preemptive mode, an arriving process with higher priority preempts the current process. In Non-Preemptive mode, current process finishes.',
      characteristics: [
        'Priority convention varies: typically, lower integer indicates higher priority (e.g. 1 > 2).',
        'Major pitfall: Indefinite blocking (starvation) of low-priority processes.',
        'Solution to starvation: Aging (gradually incrementing priority of processes waiting in ready queue).',
        'Can be configured with both internal (memory limits, time ratios) or external criteria.',
      ],
      example:
        'P1 (Priority 3) runs until P2 (Priority 1) arrives. Under preemptive scheduling, P2 immediately preempts P1.',
    },
    {
      name: 'Round Robin',
      fullName: 'Round Robin (RR)',
      type: 'Preemptive',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      principle:
        'Designed specifically for time-sharing systems. The ready queue is treated as a circular FIFO queue. The CPU dispatcher steps through the queue, giving each process a fixed time slice called a Time Quantum (q). If the process burst exceeds q, it is preempted and put back at the tail.',
      characteristics: [
        'Completely starvation-free: every process gets a guaranteed regular share of the CPU.',
        'Performance heavily depends on Time Quantum size: large q approaches FCFS; tiny q causes excessive context switches.',
        'Crucial OS Ready Queue Rule: Processes arriving during an execution slice join the queue before the preempted process is re-added.',
        'Guarantees bounded response time: response time for n processes with quantum q is at most (n-1)*q.',
      ],
      example:
        'With q=2, process P1 (BT=5) executes for 2 units, yields to P2, then waits in ready queue for its next slice.',
    },
  ];

  return (
    <div
      id="algorithms"
      className="scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-6 transition-colors"
    >
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </span>
          CPU Scheduling Algorithms Reference Guide
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed theoretical mechanisms, preemptive distinctions, trade-offs, and textbook illustrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {algorithms.map((alg) => (
          <div
            key={alg.name}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/60 p-5 space-y-3.5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700/60 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {alg.name}
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${alg.badgeColor}`}>
                  {alg.type}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {alg.fullName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {alg.principle}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400 block">
                Key Characteristics:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {alg.characteristics.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Example:</strong> {alg.example}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
