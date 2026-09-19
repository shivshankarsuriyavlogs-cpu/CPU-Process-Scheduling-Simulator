import { ProcessInput } from '../types';

export const PROCESS_COLORS: Record<string, { bg: string; border: string; text: string; lightBg: string; hex: string }> = {
  P1: { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40', hex: '#059669' },
  P2: { bg: 'bg-sky-600', border: 'border-sky-500', text: 'text-sky-700 dark:text-sky-300', lightBg: 'bg-sky-50 dark:bg-sky-950/40', hex: '#0284c7' },
  P3: { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300', lightBg: 'bg-purple-50 dark:bg-purple-950/40', hex: '#9333ea' },
  P4: { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300', lightBg: 'bg-amber-50 dark:bg-amber-950/40', hex: '#d97706' },
  P5: { bg: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-700 dark:text-rose-300', lightBg: 'bg-rose-50 dark:bg-rose-950/40', hex: '#e11d48' },
  P6: { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300', lightBg: 'bg-indigo-50 dark:bg-indigo-950/40', hex: '#4f46e5' },
  P7: { bg: 'bg-teal-600', border: 'border-teal-500', text: 'text-teal-700 dark:text-teal-300', lightBg: 'bg-teal-50 dark:bg-teal-950/40', hex: '#0d9488' },
  P8: { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-700 dark:text-orange-300', lightBg: 'bg-orange-50 dark:bg-orange-950/40', hex: '#ea580c' },
  P9: { bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-700 dark:text-cyan-300', lightBg: 'bg-cyan-50 dark:bg-cyan-950/40', hex: '#0891b2' },
  P10: { bg: 'bg-lime-600', border: 'border-lime-500', text: 'text-lime-700 dark:text-lime-300', lightBg: 'bg-lime-50 dark:bg-lime-950/40', hex: '#65a30d' },
};

export const IDLE_COLOR = {
  bg: 'bg-slate-400 dark:bg-slate-700',
  border: 'border-slate-400 dark:border-slate-600',
  text: 'text-slate-600 dark:text-slate-400',
  lightBg: 'bg-slate-100 dark:bg-slate-800/60',
  hex: '#64748b',
};

export function getProcessColor(id: string) {
  if (id === 'IDLE') return IDLE_COLOR;
  if (PROCESS_COLORS[id]) return PROCESS_COLORS[id];
  // Fallback hash color
  const palette = [
    { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300', lightBg: 'bg-blue-50 dark:bg-blue-950/40', hex: '#2563eb' },
    { bg: 'bg-violet-600', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300', lightBg: 'bg-violet-50 dark:bg-violet-950/40', hex: '#7c3aed' },
    { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40', hex: '#059669' },
  ];
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return palette[sum % palette.length];
}

// Preset examples for students to test
export interface PresetExample {
  name: string;
  description: string;
  processes: ProcessInput[];
  defaultAlgorithm: 'FCFS' | 'SJF' | 'SRTF' | 'PRIORITY_NP' | 'PRIORITY_P' | 'ROUND_ROBIN';
  quantum?: number;
}

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    name: 'Standard OS Textbook Example',
    description: '4 processes with varied arrival times, burst times, and priorities (as requested in spec)',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
      { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 2 },
    ],
    defaultAlgorithm: 'ROUND_ROBIN',
    quantum: 2,
  },
  {
    name: 'Preemption & SRTF Showcase',
    description: 'A long process arrives first, followed by shorter burst jobs that demonstrate preemptive scheduling',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 3 },
      { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 2 },
      { id: 'P4', arrivalTime: 3, burstTime: 1, priority: 4 },
      { id: 'P5', arrivalTime: 4, burstTime: 3, priority: 2 },
    ],
    defaultAlgorithm: 'SRTF',
    quantum: 2,
  },
  {
    name: 'CPU Idle Gap Test',
    description: 'Arrival times with gaps to demonstrate correct CPU idle block calculation and utilization metrics',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 3, priority: 2 },
      { id: 'P2', arrivalTime: 5, burstTime: 4, priority: 1 },
      { id: 'P3', arrivalTime: 12, burstTime: 2, priority: 3 },
      { id: 'P4', arrivalTime: 16, burstTime: 5, priority: 2 },
    ],
    defaultAlgorithm: 'FCFS',
    quantum: 3,
  },
  {
    name: 'Priority Inversion / Equal Priority',
    description: 'Identical priorities and burst times to showcase tie-breaking with arrival time and process ID',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 2 },
      { id: 'P2', arrivalTime: 2, burstTime: 4, priority: 2 },
      { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 1 },
      { id: 'P4', arrivalTime: 4, burstTime: 3, priority: 3 },
    ],
    defaultAlgorithm: 'PRIORITY_P',
    quantum: 2,
  },
];
