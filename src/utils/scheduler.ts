import {
  ProcessInput,
  AlgorithmType,
  PriorityDirection,
  GanttBlock,
  ProcessResult,
  SimulationMetrics,
  SimulationResult,
  ComparisonItem,
} from '../types';

export const ALGORITHM_NAMES: Record<AlgorithmType, string> = {
  FCFS: 'First Come First Serve (FCFS)',
  SJF: 'Shortest Job First (SJF Non-Preemptive)',
  SRTF: 'Shortest Remaining Time First (SRTF Preemptive)',
  PRIORITY_NP: 'Priority Scheduling (Non-Preemptive)',
  PRIORITY_P: 'Priority Scheduling (Preemptive)',
  ROUND_ROBIN: 'Round Robin (RR)',
};

/**
 * Validate input processes and parameters
 */
export function validateProcesses(
  processes: ProcessInput[],
  algorithm: AlgorithmType,
  quantum: number,
): { isValid: boolean; error?: string } {
  if (!processes || processes.length === 0) {
    return { isValid: false, error: 'At least one process must exist.' };
  }

  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    if (!p.id || p.id.trim() === '') {
      return { isValid: false, error: `Process at row ${i + 1} has an empty Process ID.` };
    }
    if (isNaN(p.arrivalTime) || p.arrivalTime < 0) {
      return {
        isValid: false,
        error: `Process ${p.id}: Arrival Time cannot be negative and must be a valid number.`,
      };
    }
    if (isNaN(p.burstTime) || p.burstTime <= 0) {
      return {
        isValid: false,
        error: `Process ${p.id}: Burst Time must be greater than 0.`,
      };
    }
    if (isNaN(p.priority)) {
      return {
        isValid: false,
        error: `Process ${p.id}: Priority must be a valid number.`,
      };
    }
  }

  // Check unique IDs
  const idSet = new Set<string>();
  for (const p of processes) {
    if (idSet.has(p.id)) {
      return { isValid: false, error: `Duplicate Process ID detected: "${p.id}". IDs must be unique.` };
    }
    idSet.add(p.id);
  }

  if (algorithm === 'ROUND_ROBIN') {
    if (isNaN(quantum) || quantum <= 0) {
      return { isValid: false, error: 'Time Quantum must be a number greater than 0.' };
    }
  }

  return { isValid: true };
}

/**
 * Merges consecutive identical process blocks in the Gantt chart
 */
export function compressGantt(blocks: GanttBlock[]): GanttBlock[] {
  if (blocks.length === 0) return [];
  const compressed: GanttBlock[] = [];

  for (const block of blocks) {
    if (block.duration <= 0) continue;
    const last = compressed[compressed.length - 1];
    if (last && last.id === block.id && last.endTime === block.startTime) {
      last.endTime = block.endTime;
      last.duration += block.duration;
    } else {
      compressed.push({ ...block });
    }
  }

  return compressed;
}

/**
 * Calculates per-process metrics and summary metrics given processes and gantt chart
 */
export function calculateMetrics(
  processes: ProcessInput[],
  rawGantt: GanttBlock[],
): { processResults: ProcessResult[]; metrics: SimulationMetrics } {
  const gantt = compressGantt(rawGantt);
  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].endTime : 0;

  let totalIdleTime = 0;
  for (const block of gantt) {
    if (block.id === 'IDLE') {
      totalIdleTime += block.duration;
    }
  }

  let totalBurstTime = 0;
  const processResults: ProcessResult[] = processes.map((p) => {
    totalBurstTime += p.burstTime;

    // First start time
    const processBlocks = gantt.filter((b) => b.id === p.id);
    const startTime = processBlocks.length > 0 ? processBlocks[0].startTime : p.arrivalTime;
    const completionTime =
      processBlocks.length > 0
        ? processBlocks[processBlocks.length - 1].endTime
        : p.arrivalTime;

    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = startTime - p.arrivalTime;

    return {
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    };
  });

  const count = processes.length;
  const totalWT = processResults.reduce((acc, curr) => acc + curr.waitingTime, 0);
  const totalTAT = processResults.reduce((acc, curr) => acc + curr.turnaroundTime, 0);
  const totalRT = processResults.reduce((acc, curr) => acc + curr.responseTime, 0);

  const averageWaitingTime = count > 0 ? totalWT / count : 0;
  const averageTurnaroundTime = count > 0 ? totalTAT / count : 0;
  const averageResponseTime = count > 0 ? totalRT / count : 0;
  const cpuUtilization = totalTime > 0 ? ((totalTime - totalIdleTime) / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? count / totalTime : 0;

  return {
    processResults,
    metrics: {
      averageWaitingTime: Number(averageWaitingTime.toFixed(2)),
      averageTurnaroundTime: Number(averageTurnaroundTime.toFixed(2)),
      averageResponseTime: Number(averageResponseTime.toFixed(2)),
      cpuUtilization: Number(cpuUtilization.toFixed(2)),
      throughput: Number(throughput.toFixed(4)),
      totalTime,
      totalIdleTime,
      totalBurstTime,
    },
  };
}

// ---------------------------------------------------------------------------
// 1. FCFS - First Come First Serve
// ---------------------------------------------------------------------------
export function runFCFS(processes: ProcessInput[]): GanttBlock[] {
  // Sort primarily by arrivalTime, secondary by ID
  const sorted = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  const gantt: GanttBlock[] = [];
  let currentTime = 0;

  for (const p of sorted) {
    if (currentTime < p.arrivalTime) {
      gantt.push({
        id: 'IDLE',
        startTime: currentTime,
        endTime: p.arrivalTime,
        duration: p.arrivalTime - currentTime,
      });
      currentTime = p.arrivalTime;
    }

    gantt.push({
      id: p.id,
      startTime: currentTime,
      endTime: currentTime + p.burstTime,
      duration: p.burstTime,
    });
    currentTime += p.burstTime;
  }

  return compressGantt(gantt);
}

// ---------------------------------------------------------------------------
// 2. SJF - Shortest Job First (Non-Preemptive)
// ---------------------------------------------------------------------------
export function runSJF(processes: ProcessInput[]): GanttBlock[] {
  const n = processes.length;
  const completed = new Set<string>();
  const gantt: GanttBlock[] = [];
  let currentTime = 0;

  while (completed.size < n) {
    const available = processes.filter(
      (p) => !completed.has(p.id) && p.arrivalTime <= currentTime,
    );

    if (available.length === 0) {
      // CPU Idle until next arrival
      const uncompleted = processes.filter((p) => !completed.has(p.id));
      const nextArrival = Math.min(...uncompleted.map((p) => p.arrivalTime));
      gantt.push({
        id: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
      });
      currentTime = nextArrival;
      continue;
    }

    // Select with minimum burstTime, tie-breaker: arrivalTime, then ID
    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    });

    const chosen = available[0];
    gantt.push({
      id: chosen.id,
      startTime: currentTime,
      endTime: currentTime + chosen.burstTime,
      duration: chosen.burstTime,
    });
    currentTime += chosen.burstTime;
    completed.add(chosen.id);
  }

  return compressGantt(gantt);
}

// ---------------------------------------------------------------------------
// 3. SRTF - Shortest Remaining Time First (Preemptive)
// ---------------------------------------------------------------------------
export function runSRTF(processes: ProcessInput[]): GanttBlock[] {
  const n = processes.length;
  const remaining = new Map<string, number>();
  for (const p of processes) {
    remaining.set(p.id, p.burstTime);
  }

  const gantt: GanttBlock[] = [];
  let currentTime = Math.min(...processes.map((p) => p.arrivalTime));
  if (currentTime > 0) {
    gantt.push({
      id: 'IDLE',
      startTime: 0,
      endTime: currentTime,
      duration: currentTime,
    });
  }

  let completedCount = 0;

  while (completedCount < n) {
    // Available processes with remainingTime > 0 and arrived <= currentTime
    const available = processes.filter(
      (p) => (remaining.get(p.id) ?? 0) > 0 && p.arrivalTime <= currentTime,
    );

    if (available.length === 0) {
      const uncompleted = processes.filter((p) => (remaining.get(p.id) ?? 0) > 0);
      const nextArrival = Math.min(...uncompleted.map((p) => p.arrivalTime));
      gantt.push({
        id: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
      });
      currentTime = nextArrival;
      continue;
    }

    // Select process with minimum remainingTime, tie-breaker: arrivalTime, then id
    available.sort((a, b) => {
      const remA = remaining.get(a.id) ?? 0;
      const remB = remaining.get(b.id) ?? 0;
      if (remA !== remB) return remA - remB;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    });

    const chosen = available[0];
    const rem = remaining.get(chosen.id)!;

    // Next event is either process completion OR arrival of any process that has not arrived yet
    const futureArrivals = processes
      .filter((p) => p.arrivalTime > currentTime)
      .map((p) => p.arrivalTime);

    const nextArrival = futureArrivals.length > 0 ? Math.min(...futureArrivals) : Infinity;
    const timeSlice = Math.min(rem, nextArrival - currentTime);

    gantt.push({
      id: chosen.id,
      startTime: currentTime,
      endTime: currentTime + timeSlice,
      duration: timeSlice,
    });

    currentTime += timeSlice;
    const newRem = rem - timeSlice;
    remaining.set(chosen.id, newRem);

    if (newRem === 0) {
      completedCount++;
    }
  }

  return compressGantt(gantt);
}

// ---------------------------------------------------------------------------
// 4. Priority (Non-Preemptive)
// ---------------------------------------------------------------------------
export function runPriorityNonPreemptive(
  processes: ProcessInput[],
  direction: PriorityDirection = 'LOWER_HIGHER',
): GanttBlock[] {
  const n = processes.length;
  const completed = new Set<string>();
  const gantt: GanttBlock[] = [];
  let currentTime = 0;

  const comparePriority = (a: ProcessInput, b: ProcessInput) => {
    if (a.priority !== b.priority) {
      return direction === 'LOWER_HIGHER' ? a.priority - b.priority : b.priority - a.priority;
    }
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  };

  while (completed.size < n) {
    const available = processes.filter(
      (p) => !completed.has(p.id) && p.arrivalTime <= currentTime,
    );

    if (available.length === 0) {
      const uncompleted = processes.filter((p) => !completed.has(p.id));
      const nextArrival = Math.min(...uncompleted.map((p) => p.arrivalTime));
      gantt.push({
        id: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
      });
      currentTime = nextArrival;
      continue;
    }

    available.sort(comparePriority);
    const chosen = available[0];

    gantt.push({
      id: chosen.id,
      startTime: currentTime,
      endTime: currentTime + chosen.burstTime,
      duration: chosen.burstTime,
    });
    currentTime += chosen.burstTime;
    completed.add(chosen.id);
  }

  return compressGantt(gantt);
}

// ---------------------------------------------------------------------------
// 5. Priority (Preemptive)
// ---------------------------------------------------------------------------
export function runPriorityPreemptive(
  processes: ProcessInput[],
  direction: PriorityDirection = 'LOWER_HIGHER',
): GanttBlock[] {
  const n = processes.length;
  const remaining = new Map<string, number>();
  for (const p of processes) {
    remaining.set(p.id, p.burstTime);
  }

  const gantt: GanttBlock[] = [];
  let currentTime = Math.min(...processes.map((p) => p.arrivalTime));
  if (currentTime > 0) {
    gantt.push({
      id: 'IDLE',
      startTime: 0,
      endTime: currentTime,
      duration: currentTime,
    });
  }

  let completedCount = 0;

  const comparePriority = (a: ProcessInput, b: ProcessInput) => {
    if (a.priority !== b.priority) {
      return direction === 'LOWER_HIGHER' ? a.priority - b.priority : b.priority - a.priority;
    }
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  };

  while (completedCount < n) {
    const available = processes.filter(
      (p) => (remaining.get(p.id) ?? 0) > 0 && p.arrivalTime <= currentTime,
    );

    if (available.length === 0) {
      const uncompleted = processes.filter((p) => (remaining.get(p.id) ?? 0) > 0);
      const nextArrival = Math.min(...uncompleted.map((p) => p.arrivalTime));
      gantt.push({
        id: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
      });
      currentTime = nextArrival;
      continue;
    }

    available.sort(comparePriority);
    const chosen = available[0];
    const rem = remaining.get(chosen.id)!;

    const futureArrivals = processes
      .filter((p) => p.arrivalTime > currentTime)
      .map((p) => p.arrivalTime);

    const nextArrival = futureArrivals.length > 0 ? Math.min(...futureArrivals) : Infinity;
    const timeSlice = Math.min(rem, nextArrival - currentTime);

    gantt.push({
      id: chosen.id,
      startTime: currentTime,
      endTime: currentTime + timeSlice,
      duration: timeSlice,
    });

    currentTime += timeSlice;
    const newRem = rem - timeSlice;
    remaining.set(chosen.id, newRem);

    if (newRem === 0) {
      completedCount++;
    }
  }

  return compressGantt(gantt);
}

// ---------------------------------------------------------------------------
// 6. Round Robin (RR)
// ---------------------------------------------------------------------------
export function runRoundRobin(processes: ProcessInput[], quantum: number): GanttBlock[] {
  const n = processes.length;
  const remaining = new Map<string, number>();
  for (const p of processes) {
    remaining.set(p.id, p.burstTime);
  }

  // Sorted by arrival time, then ID
  const processMap = new Map<string, ProcessInput>();
  for (const p of processes) processMap.set(p.id, p);

  const sortedArrivals = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  const arrivedSet = new Set<string>();
  const readyQueue: string[] = [];
  const gantt: GanttBlock[] = [];
  let currentTime = 0;
  let completedCount = 0;

  // Initialize at min arrival time if needed
  if (sortedArrivals.length > 0 && sortedArrivals[0].arrivalTime > 0) {
    gantt.push({
      id: 'IDLE',
      startTime: 0,
      endTime: sortedArrivals[0].arrivalTime,
      duration: sortedArrivals[0].arrivalTime,
    });
    currentTime = sortedArrivals[0].arrivalTime;
  }

  // Enqueue initial processes
  for (const p of sortedArrivals) {
    if (p.arrivalTime <= currentTime && !arrivedSet.has(p.id)) {
      readyQueue.push(p.id);
      arrivedSet.add(p.id);
    }
  }

  while (completedCount < n) {
    if (readyQueue.length === 0) {
      // Find next unarrived process
      const unarrived = sortedArrivals.filter((p) => !arrivedSet.has(p.id));
      if (unarrived.length > 0) {
        const nextArrival = unarrived[0].arrivalTime;
        gantt.push({
          id: 'IDLE',
          startTime: currentTime,
          endTime: nextArrival,
          duration: nextArrival - currentTime,
        });
        currentTime = nextArrival;
        for (const p of sortedArrivals) {
          if (p.arrivalTime <= currentTime && !arrivedSet.has(p.id)) {
            readyQueue.push(p.id);
            arrivedSet.add(p.id);
          }
        }
      }
      continue;
    }

    const currentId = readyQueue.shift()!;
    const rem = remaining.get(currentId)!;
    const timeSlice = Math.min(rem, quantum);

    const startTime = currentTime;
    const endTime = currentTime + timeSlice;

    gantt.push({
      id: currentId,
      startTime,
      endTime,
      duration: timeSlice,
    });

    currentTime = endTime;
    const newRem = rem - timeSlice;
    remaining.set(currentId, newRem);

    // Standard OS Rule: Check if any new process arrived DURING this slice [startTime + 1, endTime]
    for (const p of sortedArrivals) {
      if (p.arrivalTime <= currentTime && !arrivedSet.has(p.id)) {
        readyQueue.push(p.id);
        arrivedSet.add(p.id);
      }
    }

    // If current process still has burst left, re-queue it at the back
    if (newRem > 0) {
      readyQueue.push(currentId);
    } else {
      completedCount++;
    }
  }

  return compressGantt(gantt);
}

// ---------------------------------------------------------------------------
// Unified Runner
// ---------------------------------------------------------------------------
export function runSimulation(
  processes: ProcessInput[],
  algorithm: AlgorithmType,
  quantum = 2,
  priorityDirection: PriorityDirection = 'LOWER_HIGHER',
): SimulationResult {
  let gantt: GanttBlock[] = [];

  switch (algorithm) {
    case 'FCFS':
      gantt = runFCFS(processes);
      break;
    case 'SJF':
      gantt = runSJF(processes);
      break;
    case 'SRTF':
      gantt = runSRTF(processes);
      break;
    case 'PRIORITY_NP':
      gantt = runPriorityNonPreemptive(processes, priorityDirection);
      break;
    case 'PRIORITY_P':
      gantt = runPriorityPreemptive(processes, priorityDirection);
      break;
    case 'ROUND_ROBIN':
      gantt = runRoundRobin(processes, quantum);
      break;
  }

  const { processResults, metrics } = calculateMetrics(processes, gantt);

  return {
    algorithm,
    algorithmName: ALGORITHM_NAMES[algorithm],
    ganttChart: gantt,
    processResults,
    metrics,
    timeQuantum: algorithm === 'ROUND_ROBIN' ? quantum : undefined,
    priorityDirection: algorithm.startsWith('PRIORITY') ? priorityDirection : undefined,
  };
}

// ---------------------------------------------------------------------------
// Compare All Algorithms
// ---------------------------------------------------------------------------
export function runAllAlgorithms(
  processes: ProcessInput[],
  quantum = 2,
  priorityDirection: PriorityDirection = 'LOWER_HIGHER',
): ComparisonItem[] {
  const algorithms: { type: AlgorithmType; name: string; isPreemptive: boolean }[] = [
    { type: 'FCFS', name: 'FCFS', isPreemptive: false },
    { type: 'SJF', name: 'SJF (Non-Preemptive)', isPreemptive: false },
    { type: 'SRTF', name: 'SRTF (Preemptive)', isPreemptive: true },
    { type: 'PRIORITY_NP', name: 'Priority (Non-Preemptive)', isPreemptive: false },
    { type: 'PRIORITY_P', name: 'Priority (Preemptive)', isPreemptive: true },
    { type: 'ROUND_ROBIN', name: `Round Robin (Q=${quantum})`, isPreemptive: true },
  ];

  return algorithms.map((alg) => {
    const res = runSimulation(processes, alg.type, quantum, priorityDirection);
    return {
      algorithm: alg.type,
      name: alg.name,
      isPreemptive: alg.isPreemptive,
      avgWT: res.metrics.averageWaitingTime,
      avgTAT: res.metrics.averageTurnaroundTime,
      avgRT: res.metrics.averageResponseTime,
      cpuUtilization: res.metrics.cpuUtilization,
      throughput: res.metrics.throughput,
      totalTime: res.metrics.totalTime,
    };
  });
}

// ---------------------------------------------------------------------------
// CSV Export Helper
// ---------------------------------------------------------------------------
export function exportToCSV(simulation: SimulationResult): string {
  const headers = ['Process', 'Arrival Time', 'Burst Time', 'Priority', 'Completion Time', 'Turnaround Time', 'Waiting Time', 'Response Time'];
  const rows = simulation.processResults.map((p) => [
    p.id,
    p.arrivalTime,
    p.burstTime,
    p.priority,
    p.completionTime,
    p.turnaroundTime,
    p.waitingTime,
    p.responseTime,
  ]);

  const csvContent = [
    `# CPU Process Scheduling Simulation: ${simulation.algorithmName}`,
    headers.join(','),
    ...rows.map((row) => row.join(',')),
    '',
    '# Performance Metrics',
    `Average Waiting Time,${simulation.metrics.averageWaitingTime}`,
    `Average Turnaround Time,${simulation.metrics.averageTurnaroundTime}`,
    `Average Response Time,${simulation.metrics.averageResponseTime}`,
    `CPU Utilization (%),${simulation.metrics.cpuUtilization}%`,
    `Throughput,${simulation.metrics.throughput} processes/unit time`,
    `Total Time,${simulation.metrics.totalTime}`,
  ].join('\n');

  return csvContent;
}
