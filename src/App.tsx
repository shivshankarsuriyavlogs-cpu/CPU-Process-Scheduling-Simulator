import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProcessInputCard from './components/ProcessInputCard';
import GanttChart from './components/GanttChart';
import PerformanceSummary from './components/PerformanceSummary';
import ResultsTable from './components/ResultsTable';
import AlgorithmComparison from './components/AlgorithmComparison';
import AlgorithmInfo from './components/AlgorithmInfo';
import FormulasSection from './components/FormulasSection';
import AboutSection from './components/AboutSection';
import HistoryDrawer from './components/HistoryDrawer';
import Footer from './components/Footer';

import {
  ProcessInput,
  AlgorithmType,
  PriorityDirection,
  SimulationResult,
  ComparisonItem,
  HistoryEntry,
} from './types';
import {
  validateProcesses,
  runSimulation,
  runAllAlgorithms,
} from './utils/scheduler';
import { PRESET_EXAMPLES } from './utils/colors';

const STORAGE_KEY_HISTORY = 'cpu_sim_history_v1';
const STORAGE_KEY_THEME = 'cpu_sim_theme_v1';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Simulator state - initialized with the standard textbook example from prompt
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
    { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 2 },
  ]);

  const [algorithm, setAlgorithm] = useState<AlgorithmType>('ROUND_ROBIN');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [priorityDirection, setPriorityDirection] = useState<PriorityDirection>('LOWER_HIGHER');

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonItem[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return [];
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Synchronize Dark Mode class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Persist history
  const saveToHistory = useCallback((result: SimulationResult, procs: ProcessInput[]) => {
    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      algorithm: result.algorithm,
      algorithmName: result.algorithmName,
      processCount: procs.length,
      avgWT: result.metrics.averageWaitingTime,
      avgTAT: result.metrics.averageTurnaroundTime,
      cpuUtilization: result.metrics.cpuUtilization,
      processes: JSON.parse(JSON.stringify(procs)),
      timeQuantum: result.timeQuantum,
      priorityDirection: result.priorityDirection,
    };

    setHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Run simulation handler
  const handleRunSimulation = useCallback((
    customProcesses?: ProcessInput[],
    customAlgorithm?: AlgorithmType,
    customQuantum?: number,
    customPriorityDir?: PriorityDirection,
    shouldScroll: boolean = false,
  ) => {
    const procsToRun = customProcesses || processes;
    const algToRun = customAlgorithm || algorithm;
    const qToRun = customQuantum !== undefined ? customQuantum : timeQuantum;
    const pDirToRun = customPriorityDir || priorityDirection;

    const validation = validateProcesses(procsToRun, algToRun, qToRun);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid process inputs detected.');
      return;
    }

    try {
      setValidationError(null);
      const result = runSimulation(procsToRun, algToRun, qToRun, pDirToRun);
      const compResults = runAllAlgorithms(procsToRun, qToRun, pDirToRun);

      setSimulationResult(result);
      setComparisonData(compResults);
      saveToHistory(result, procsToRun);
    } catch (error) {
      console.error('Simulation failed:', error);
      setSimulationResult(null);
      setComparisonData(null);
      setValidationError(
        error instanceof Error
          ? `Simulation error: ${error.message}`
          : 'Simulation failed. Please check the process inputs and try again.',
      );
    }

    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById('gantt');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  }, [processes, algorithm, timeQuantum, priorityDirection, saveToHistory]);

  // Initial simulation is intentionally deferred until the first browser paint.
  // This prevents a scheduler/runtime exception from ever producing a blank page.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      handleRunSimulation();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [handleRunSimulation]);

  // Compare All button handler
  const handleCompareAll = () => {
    const validation = validateProcesses(processes, algorithm, timeQuantum);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid process inputs detected.');
      return;
    }
    setValidationError(null);
    const compResults = runAllAlgorithms(processes, timeQuantum, priorityDirection);
    setComparisonData(compResults);

    // Smooth scroll to comparison section
    const el = document.getElementById('comparison');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset handler
  const handleReset = () => {
    const defaultPreset = PRESET_EXAMPLES[0];
    setProcesses(defaultPreset.processes);
    setAlgorithm(defaultPreset.defaultAlgorithm);
    setTimeQuantum(defaultPreset.quantum || 2);
    setPriorityDirection('LOWER_HIGHER');
    setValidationError(null);
    handleRunSimulation(
      defaultPreset.processes,
      defaultPreset.defaultAlgorithm,
      defaultPreset.quantum || 2,
      'LOWER_HIGHER',
    );
  };

  const handleClearResults = () => {
    setSimulationResult(null);
    setComparisonData(null);
    setValidationError(null);
  };

  const handleLoadPreset = (index: number) => {
    const preset = PRESET_EXAMPLES[index] || PRESET_EXAMPLES[0];
    setProcesses(preset.processes);
    setAlgorithm(preset.defaultAlgorithm);
    if (preset.quantum) {
      setTimeQuantum(preset.quantum);
    }
    setValidationError(null);
    handleRunSimulation(
      preset.processes,
      preset.defaultAlgorithm,
      preset.quantum || timeQuantum,
      priorityDirection,
    );
  };

  const handleRestoreFromHistory = (entry: HistoryEntry) => {
    setProcesses(entry.processes);
    setAlgorithm(entry.algorithm);
    if (entry.timeQuantum) setTimeQuantum(entry.timeQuantum);
    if (entry.priorityDirection) setPriorityDirection(entry.priorityDirection);
    setValidationError(null);
    handleRunSimulation(
      entry.processes,
      entry.algorithm,
      entry.timeQuantum || timeQuantum,
      entry.priorityDirection || priorityDirection,
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Hero Section */}
      <Hero
        onStartSimulation={() => {
          const el = document.getElementById('simulator');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onExploreAlgorithms={() => {
          const el = document.getElementById('algorithms');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Simulator Input Card */}
        <ProcessInputCard
          processes={processes}
          algorithm={algorithm}
          timeQuantum={timeQuantum}
          priorityDirection={priorityDirection}
          onUpdateProcesses={(newProcs) => {
            setProcesses(newProcs);
            const val = validateProcesses(newProcs, algorithm, timeQuantum);
            if (val.isValid) {
              handleRunSimulation(newProcs, algorithm, timeQuantum, priorityDirection, false);
            }
          }}
          onSelectAlgorithm={(alg) => {
            setAlgorithm(alg);
            const val = validateProcesses(processes, alg, timeQuantum);
            if (val.isValid) {
              handleRunSimulation(processes, alg, timeQuantum, priorityDirection, false);
            }
          }}
          onChangeTimeQuantum={(q) => {
            setTimeQuantum(q);
            if (algorithm === 'ROUND_ROBIN') {
              const val = validateProcesses(processes, algorithm, q);
              if (val.isValid) {
                handleRunSimulation(processes, algorithm, q, priorityDirection, false);
              }
            }
          }}
          onChangePriorityDirection={(dir) => {
            setPriorityDirection(dir);
            if (algorithm.startsWith('PRIORITY')) {
              const val = validateProcesses(processes, algorithm, timeQuantum);
              if (val.isValid) {
                handleRunSimulation(processes, algorithm, timeQuantum, dir, false);
              }
            }
          }}
          onRunSimulation={() => handleRunSimulation(processes, algorithm, timeQuantum, priorityDirection, true)}
          onCompareAll={handleCompareAll}
          onReset={handleReset}
          onClearResults={handleClearResults}
          onLoadPreset={handleLoadPreset}
          validationError={validationError}
        />

        {/* Results Section (shown whenever simulationResult exists) */}
        {simulationResult && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Performance Summary Cards */}
            <PerformanceSummary
              metrics={simulationResult.metrics}
              processCount={simulationResult.processResults.length}
            />

            {/* Gantt Chart & Timeline */}
            <GanttChart
              ganttChart={simulationResult.ganttChart}
              algorithmName={simulationResult.algorithmName}
            />

            {/* Per-process execution results table */}
            <ResultsTable simulation={simulationResult} />
          </div>
        )}

        {/* Algorithm Comparison Section */}
        {comparisonData && (
          <AlgorithmComparison
            comparisonData={comparisonData}
            timeQuantum={timeQuantum}
          />
        )}

        {/* Educational Reference Cards */}
        <AlgorithmInfo />

        {/* Educational Formulas Section */}
        <FormulasSection />

        {/* About CPU Scheduling Section */}
        <AboutSection />
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreFromHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
