import { ArrowRight, BookOpen, Play, Activity } from 'lucide-react';

interface HeroProps {
  onStartSimulation: () => void;
  onExploreAlgorithms: () => void;
}

export default function Hero({ onStartSimulation, onExploreAlgorithms }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pb-20 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-slate-900/50 dark:via-slate-950 dark:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              OS Education & Dynamic CPU Simulation
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              CPU Process Scheduling Simulator
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Simulate CPU scheduling algorithms and visualize process execution with real-time performance calculations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-start-simulation-btn"
                type="button"
                onClick={onStartSimulation}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Simulation
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-algorithms-btn"
                type="button"
                onClick={onExploreAlgorithms}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Explore Algorithms
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                FCFS, SJF, SRTF, Priority & Round Robin
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Gantt Chart & CPU Idle Handling
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                CT, TAT, WT, RT & Utilization
              </span>
            </div>
          </div>

          {/* Processor Microchip Diagram / Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-blue-950/20">
              {/* Decorative circuit pins */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  CPU CORE 01
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold">
                  DISPATCHER: READY
                </span>
              </div>

              {/* Microchip Schematic */}
              <div className="py-5 relative">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* Ready Queue */}
                  <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      Ready Queue
                    </p>
                    <div className="mt-2 flex flex-col gap-1 items-center font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium text-[11px] w-full">P1 [AT:0]</span>
                      <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-medium text-[11px] w-full">P2 [AT:1]</span>
                      <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-medium text-[11px] w-full">P3 [AT:2]</span>
                    </div>
                  </div>

                  {/* CPU Engine */}
                  <div className="p-3 rounded-lg bg-slate-900 text-white dark:bg-black/60 border border-slate-700 flex flex-col items-center justify-between shadow-inner">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      CPU ALU
                    </p>
                    <div className="my-2 p-2 rounded-md bg-blue-600/30 border border-blue-500/40 text-center w-full">
                      <span className="text-xs font-mono text-blue-300 block font-semibold">EXECUTING</span>
                      <span className="text-sm font-bold text-white font-mono">P1</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Clock: Tick</span>
                  </div>

                  {/* Finished / Metrics */}
                  <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                      Metrics
                    </p>
                    <div className="mt-2 text-left space-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>TAT</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">CT − AT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WT</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">TAT − BT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RT</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">ST − AT</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Bus Lines */}
                <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[11px]">System Bus: 64-bit</span>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-medium">Real-Time Event Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
