import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, StepForward, StepBack, Clock, Cpu } from 'lucide-react';
import { GanttBlock } from '../types';
import { getProcessColor } from '../utils/colors';

interface GanttChartProps {
  ganttChart: GanttBlock[];
  algorithmName: string;
}

export default function GanttChart({ ganttChart, algorithmName }: GanttChartProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(ganttChart.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [hoveredBlock, setHoveredBlock] = useState<GanttBlock | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // When ganttChart changes, reset scrubber to full view
  useEffect(() => {
    setCurrentStepIndex(ganttChart.length);
    setIsPlaying(false);
  }, [ganttChart]);

  // Handle Playback
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex >= ganttChart.length) {
        setCurrentStepIndex(0);
      }

      const intervalMs = Math.round(900 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < ganttChart.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, ganttChart.length, playbackSpeed]);

  if (ganttChart.length === 0) {
    return (
      <div
        id="gantt"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500"
      >
        <Cpu className="w-10 h-10 mx-auto mb-3 text-slate-400" />
        <p className="font-semibold">No simulation data available</p>
        <p className="text-sm">Run the simulation to generate the Gantt chart timeline.</p>
      </div>
    );
  }

  const totalTime = ganttChart[ganttChart.length - 1].endTime;
  const visibleBlocks = ganttChart.slice(0, currentStepIndex);
  const currentBlock = currentStepIndex > 0 ? ganttChart[currentStepIndex - 1] : null;

  // Extract unique process IDs for legend
  const uniqueProcessIds = Array.from(new Set(ganttChart.map((b) => b.id)));

  return (
    <div
      id="gantt"
      className="scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 lg:p-8 space-y-6 transition-colors"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5" />
            </span>
            Gantt Chart & CPU Execution Timeline
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualizing dispatch intervals for <strong className="text-slate-800 dark:text-slate-200">{algorithmName}</strong> (Total: {totalTime} time units)
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex <= 0}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            title="Step Backward"
          >
            <StepBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStepIndex >= ganttChart.length) {
                setCurrentStepIndex(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" /> {currentStepIndex >= ganttChart.length ? 'Replay' : 'Play'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentStepIndex((prev) => Math.min(ganttChart.length, prev + 1))}
            disabled={currentStepIndex >= ganttChart.length}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            title="Step Forward"
          >
            <StepForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(ganttChart.length);
            }}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
            title="Show Full Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="text-xs font-semibold px-2 py-1 rounded-lg bg-transparent text-slate-700 dark:text-slate-300 cursor-pointer border-0 focus:outline-none"
            title="Playback Speed"
          >
            <option value={0.5} className="dark:bg-slate-800">0.5x</option>
            <option value={1} className="dark:bg-slate-800">1.0x</option>
            <option value={2} className="dark:bg-slate-800">2.0x</option>
          </select>
        </div>
      </div>

      {/* Scrubber progress info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Step: <strong className="text-slate-800 dark:text-slate-200">{currentStepIndex}</strong> of {ganttChart.length} blocks
        </span>
        {currentBlock && (
          <span className="font-mono">
            Active Block: <strong className="text-blue-600 dark:text-blue-400">{currentBlock.id}</strong> [{currentBlock.startTime} → {currentBlock.endTime}] ({currentBlock.duration}u)
          </span>
        )}
      </div>

      {/* Primary Gantt Bar Container */}
      <div className="relative pt-2 pb-6">
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          {/* Minimum width ensures proper readability for small blocks on mobile */}
          <div className="min-w-[640px]">
            {/* The Gantt blocks row */}
            <div className="h-16 flex rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-950">
              {ganttChart.map((block, idx) => {
                const isVisible = idx < currentStepIndex;
                const isCurrentlyActive = idx === currentStepIndex - 1;
                const widthPercent = (block.duration / totalTime) * 100;
                const colorInfo = getProcessColor(block.id);
                const isIdle = block.id === 'IDLE';

                return (
                  <div
                    key={`${block.id}-${block.startTime}-${idx}`}
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    style={{ width: `${widthPercent}%` }}
                    className={`relative h-full flex flex-col items-center justify-center border-r border-white/20 dark:border-black/30 transition-all duration-300 cursor-pointer select-none ${
                      isVisible
                        ? isIdle
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : `${colorInfo.bg} text-white`
                        : 'bg-slate-200/50 dark:bg-slate-900/40 text-transparent opacity-20'
                    } ${isCurrentlyActive ? 'ring-3 ring-amber-400 ring-inset z-10' : ''}`}
                  >
                    {/* Pattern for idle */}
                    {isIdle && isVisible && (
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:6px_6px]" />
                    )}

                    {isVisible && (
                      <>
                        <span className="font-bold text-xs sm:text-sm tracking-wide z-10">
                          {block.id}
                        </span>
                        <span className="text-[10px] font-mono opacity-85 z-10">
                          {block.duration}u
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Ticks Axis along the bottom */}
            <div className="relative h-7 mt-1.5 flex text-xs font-mono text-slate-600 dark:text-slate-400">
              {/* Start tick 0 */}
              <div className="absolute left-0 -translate-x-1/2 flex flex-col items-center">
                <div className="w-0.5 h-2 bg-slate-400 dark:bg-slate-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">0</span>
              </div>

              {/* Ticks at end of each block */}
              {ganttChart.map((block, idx) => {
                const rightPercent = (block.endTime / totalTime) * 100;
                const isVisible = idx < currentStepIndex;

                return (
                  <div
                    key={`tick-${block.endTime}-${idx}`}
                    style={{ left: `${rightPercent}%` }}
                    className={`absolute -translate-x-1/2 flex flex-col items-center transition-opacity duration-300 ${
                      isVisible ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div className="w-0.5 h-2 bg-slate-400 dark:bg-slate-600" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {block.endTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hover block tooltip details */}
        {hoveredBlock && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getProcessColor(hoveredBlock.id).hex }}
              />
              <span className="font-bold text-slate-900 dark:text-white">
                Block: {hoveredBlock.id}
              </span>
              {hoveredBlock.id === 'IDLE' && (
                <span className="text-slate-500 italic">(CPU had no ready process to execute)</span>
              )}
            </div>
            <div className="flex items-center gap-4 font-mono text-slate-600 dark:text-slate-300">
              <span>Start: <strong>{hoveredBlock.startTime}</strong></span>
              <span>End: <strong>{hoveredBlock.endTime}</strong></span>
              <span>Duration: <strong>{hoveredBlock.duration} units</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Legend:</span>
        {uniqueProcessIds.map((id) => {
          const col = getProcessColor(id);
          return (
            <div
              key={`legend-${id}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <span
                className="w-2.5 h-2.5 rounded-xs"
                style={{ backgroundColor: col.hex }}
              />
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
