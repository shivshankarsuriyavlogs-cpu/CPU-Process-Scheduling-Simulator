export interface ProcessInput {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export type AlgorithmType =
  | 'FCFS'
  | 'SJF'
  | 'SRTF'
  | 'PRIORITY_NP'
  | 'PRIORITY_P'
  | 'ROUND_ROBIN';

export type PriorityDirection = 'LOWER_HIGHER' | 'HIGHER_HIGHER';

export interface GanttBlock {
  id: string; // process ID or 'IDLE'
  startTime: number;
  endTime: number;
  duration: number;
}

export interface ProcessResult {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  startTime: number; // first start time
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

export interface SimulationMetrics {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number; // percentage 0-100
  throughput: number; // processes per unit time
  totalTime: number;
  totalIdleTime: number;
  totalBurstTime: number;
}

export interface SimulationResult {
  algorithm: AlgorithmType;
  algorithmName: string;
  ganttChart: GanttBlock[];
  processResults: ProcessResult[];
  metrics: SimulationMetrics;
  timeQuantum?: number;
  priorityDirection?: PriorityDirection;
}

export interface ComparisonItem {
  algorithm: AlgorithmType;
  name: string;
  isPreemptive: boolean;
  avgWT: number;
  avgTAT: number;
  avgRT: number;
  cpuUtilization: number;
  throughput: number;
  totalTime: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  algorithm: AlgorithmType;
  algorithmName: string;
  processCount: number;
  avgWT: number;
  avgTAT: number;
  cpuUtilization: number;
  processes: ProcessInput[];
  timeQuantum?: number;
  priorityDirection?: PriorityDirection;
}
