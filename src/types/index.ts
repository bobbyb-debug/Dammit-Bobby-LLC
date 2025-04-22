
export interface Job {
  id: string;
  date: Date;
  cabin: string;
  bedCount: number;
  notes: string;
  total: number;
  createdAt: Date;
}

export interface CabinRate {
  id: string;
  name: string;
  baseRate: number;
  bedRate: number;
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

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
}
