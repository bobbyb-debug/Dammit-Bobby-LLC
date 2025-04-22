
import { Job, CabinRate, Invoice, CompanyInfo } from "@/types";
import { addDays } from "date-fns";

export const companyInfo: CompanyInfo = {
  name: "Dammit Bobby LLC",
  address: "23588 Old Highway 160",
  city: "Reeds Spring",
  state: "MO",
  zip: "65737",
  email: "dammitbobby2024@outlook.com",
  phone: "+1 (841) 290-2583"
}

export const cabinRates: CabinRate[] = [
  {
    id: "1",
    name: "Cedar Lodge",
    baseRate: 70,
    bedRate: 15,
  },
  {
    id: "2",
    name: "Pine Retreat",
    baseRate: 85,
    bedRate: 18,
  },
  {
    id: "3",
    name: "Lakeside Cabin",
    baseRate: 95,
    bedRate: 18,
  },
  {
    id: "4",
    name: "Mountain View",
    baseRate: 80,
    bedRate: 15,
  },
  {
    id: "5",
    name: "Forest Haven",
    baseRate: 75,
    bedRate: 15,
  }
];

export const sampleJobs: Job[] = [
  {
    id: "1",
    date: new Date("2025-03-27T11:00:00"),
    cabin: "Cedar Lodge",
    bedCount: 8,
    notes: "Weekly clean",
    total: 190,
    createdAt: new Date("2025-03-27T13:00:00"),
  },
  {
    id: "2",
    date: new Date("2025-02-28T09:00:00"),
    cabin: "Pine Retreat",
    bedCount: 7.5,
    notes: "Monthly deep clean",
    total: 220,
    createdAt: new Date("2025-02-28T12:00:00"),
  },
  {
    id: "3",
    date: new Date("2025-03-01T10:00:00"),
    cabin: "Lakeside Cabin",
    bedCount: 7.5,
    notes: "Guest checkout",
    total: 230,
    createdAt: new Date("2025-03-01T13:00:00"),
  },
  {
    id: "4",
    date: new Date("2025-03-02T10:00:00"),
    cabin: "Mountain View",
    bedCount: 3,
    notes: "Quick turnover",
    total: 125,
    createdAt: new Date("2025-03-02T12:00:00"),
  },
  {
    id: "5",
    date: new Date("2025-03-03T10:00:00"),
    cabin: "Forest Haven",
    bedCount: 8,
    notes: "Weekly clean",
    total: 195,
    createdAt: new Date("2025-03-03T13:00:00"),
  },
  {
    id: "6",
    date: new Date("2025-03-04T10:15:00"),
    cabin: "Cedar Lodge",
    bedCount: 3.25,
    notes: "Light clean",
    total: 118.75,
    createdAt: new Date("2025-03-04T12:00:00"),
  },
  {
    id: "7",
    date: new Date("2025-03-08T07:15:00"),
    cabin: "Pine Retreat",
    bedCount: 5.25,
    notes: "Standard clean",
    total: 179.5,
    createdAt: new Date("2025-03-08T10:00:00"),
  }
];

export const sampleInvoices: Invoice[] = [
  {
    id: "1",
    number: "2001",
    date: new Date("2025-03-04"),
    dueDate: new Date("2025-03-04"),
    jobs: sampleJobs,
    clientName: "Sunshine Murray",
    clientAddress: "31 Henderson Road",
    clientCity: "Reeds Spring",
    clientState: "MO",
    clientZip: "65737",
    status: "pending",
    total: 765.00
  },
  {
    id: "2",
    number: "2002",
    date: new Date("2025-03-10"),
    dueDate: addDays(new Date("2025-03-10"), 15),
    jobs: sampleJobs.slice(0, 3),
    clientName: "Mountain Retreat LLC",
    clientAddress: "450 Lodge Drive",
    clientCity: "Branson",
    clientState: "MO",
    clientZip: "65616",
    status: "paid",
    total: 640.00
  },
  {
    id: "3",
    number: "2003",
    date: new Date("2025-02-25"),
    dueDate: new Date("2025-03-10"),
    jobs: sampleJobs.slice(3, 5),
    clientName: "Ozark Cabin Rentals",
    clientAddress: "782 Lake Road",
    clientCity: "Kimberling City",
    clientState: "MO",
    clientZip: "65686",
    status: "overdue",
    total: 320.00
  }
];

// Local storage management
const JOBS_KEY = "dammit-bobby-jobs";
const RATES_KEY = "dammit-bobby-rates";
const INVOICES_KEY = "dammit-bobby-invoices";

// Get data from local storage or use sample data
export const getJobs = (): Job[] => {
  const storedJobs = localStorage.getItem(JOBS_KEY);
  if (storedJobs) {
    const parsedJobs = JSON.parse(storedJobs);
    return parsedJobs.map((job: any) => ({
      ...job,
      date: new Date(job.date),
      createdAt: new Date(job.createdAt),
    }));
  }
  return sampleJobs;
};

export const getCabinRates = (): CabinRate[] => {
  const storedRates = localStorage.getItem(RATES_KEY);
  return storedRates ? JSON.parse(storedRates) : cabinRates;
};

export const getInvoices = (): Invoice[] => {
  const storedInvoices = localStorage.getItem(INVOICES_KEY);
  if (storedInvoices) {
    const parsedInvoices = JSON.parse(storedInvoices);
    return parsedInvoices.map((invoice: any) => ({
      ...invoice,
      date: new Date(invoice.date),
      dueDate: new Date(invoice.dueDate),
      jobs: invoice.jobs.map((job: any) => ({
        ...job,
        date: new Date(job.date),
        createdAt: new Date(job.createdAt),
      })),
    }));
  }
  return sampleInvoices;
};

// Save data to local storage
export const saveJobs = (jobs: Job[]): void => {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
};

export const saveCabinRates = (rates: CabinRate[]): void => {
  localStorage.setItem(RATES_KEY, JSON.stringify(rates));
};

export const saveInvoices = (invoices: Invoice[]): void => {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
};

// Helper functions for data manipulation
export const addJob = (job: Omit<Job, "id" | "createdAt">): Job => {
  const newJob: Job = {
    ...job,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  
  const jobs = getJobs();
  const updatedJobs = [...jobs, newJob];
  saveJobs(updatedJobs);
  
  return newJob;
};

export const updateCabinRate = (rate: CabinRate): void => {
  const rates = getCabinRates();
  const updatedRates = rates.map(r => r.id === rate.id ? rate : r);
  saveCabinRates(updatedRates);
};

export const addCabinRate = (rate: Omit<CabinRate, "id">): CabinRate => {
  const newRate: CabinRate = {
    ...rate,
    id: Date.now().toString(),
  };
  
  const rates = getCabinRates();
  const updatedRates = [...rates, newRate];
  saveCabinRates(updatedRates);
  
  return newRate;
};

export const deleteCabinRate = (id: string): void => {
  const rates = getCabinRates();
  const updatedRates = rates.filter(r => r.id !== id);
  saveCabinRates(updatedRates);
};

export const addInvoice = (invoice: Omit<Invoice, "id">): Invoice => {
  const newInvoice: Invoice = {
    ...invoice,
    id: Date.now().toString(),
  };
  
  const invoices = getInvoices();
  const updatedInvoices = [...invoices, newInvoice];
  saveInvoices(updatedInvoices);
  
  return newInvoice;
};

export const updateInvoiceStatus = (id: string, status: Invoice["status"]): void => {
  const invoices = getInvoices();
  const updatedInvoices = invoices.map(inv => 
    inv.id === id ? {...inv, status} : inv
  );
  saveInvoices(updatedInvoices);
};

export const getNextInvoiceNumber = (): string => {
  const invoices = getInvoices();
  if (invoices.length === 0) return "1001";
  
  const maxNumber = Math.max(
    ...invoices.map(inv => parseInt(inv.number))
  );
  return (maxNumber + 1).toString();
};

export const calculateJobTotal = (
  cabinName: string, 
  bedCount: number
): number => {
  const cabin = getCabinRates().find(c => c.name === cabinName);
  if (!cabin) return 0;
  
  return cabin.baseRate + (cabin.bedRate * bedCount);
};
