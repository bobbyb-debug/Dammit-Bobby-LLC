export type JobType = "cleaning" | "lawncare" | "handyman" | "custom";

export interface Job {
  id: string;
  jobType: JobType;
  date: Date;
  createdAt: Date;
  clientName?: string;
  address?: string;

  // Cabin-style cleaning only
  cabin?: string;
  bedCount?: number;

  // For custom jobs
  serviceName?: string;
  startTime?: string;
  endTime?: string;
  hourlyRate?: number;
  hoursWorked?: number;

  notes?: string;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  jobs: Job[];
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  status: 'pending' | 'paid' | 'overdue';
  total: number;
}

export interface CabinRate {
  id: string;
  name: string;
  baseRate: number;
  bedRate: number;
}
