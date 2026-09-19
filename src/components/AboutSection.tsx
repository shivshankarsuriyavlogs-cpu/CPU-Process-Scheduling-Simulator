import { Info, GraduationCap, Cpu, Layers, Terminal } from 'lucide-react';

export default function AboutSection() {
  const targetAudience = [
    { label: 'B.Tech / CSE Students', desc: 'Core semester Operating Systems (OS) lab & theory prep.' },
    { label: 'Diploma Engineering Students', desc: 'Clear visual understanding of process state transitions.' },
    { label: 'Operating Systems Learners', desc: 'Interactive experimentation with preemption & idle times.' },
    { label: 'Computer Science Aspirants', desc: 'GATE, university, and technical interview preparation.' },
  ];

  return (
    <div
      id="about"
      className="scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-6 transition-colors"
    >
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Info className="w-5 h-5" />
          </span>
          About CPU Scheduling Simulator
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          An interactive laboratory tool for exploring multiprogramming mechanisms and CPU dispatcher logic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white">CPU Scheduling</strong> is the fundamental Operating Systems mechanism that determines which process in the ready queue is allocated the Central Processing Unit (CPU) when it becomes available. By multiplexing CPU execution among multiple ready processes, operating systems maximize CPU utilization and enable responsive interactive computing.
          </p>
          <p>
            In multiprogramming environments, processes alternate between CPU execution bursts and I/O wait cycles. The <strong className="text-slate-900 dark:text-white">short-term scheduler (CPU scheduler)</strong> executes at high frequency, making critical dispatch decisions that dictate system throughput, average waiting time, turnaround duration, and interactive responsiveness.
          </p>
          <p>
            This simulator executes mathematically rigorous scheduling engines completely client-side in your browser. Students can enter custom arrival times, burst durations, and priority ranks to verify textbook problems, observe preemption behavior, and examine how idle CPU periods occur during asynchronous process arrivals.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Preemptive &amp; Non-Preemptive
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              Dynamic Gantt Timelines
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              Zero Backend / 100% Browser
            </span>
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Designed For Academic Learning
          </div>
          <div className="space-y-2.5">
            {targetAudience.map((aud) => (
              <div
                key={aud.label}
                className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {aud.label}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block">
                  {aud.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
