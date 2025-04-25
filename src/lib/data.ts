import { v4 as uuidv4 } from "uuid";
import { Job, Invoice, CabinRate } from "@/types";

// In-memory mock databases
const jobs: Job[] = [];
const invoices: Invoice[] = [];
const cabinRates: CabinRate[] = [
  { id: "1", name: "Cedar Lodge", baseRate: 75, bedRate: 10 },
  { id: "2", name: "Oak Haven", baseRate: 65, bedRate: 12 },
];

// Cabin job pricing logic
export const calculateJobTotal = (cabinName: string, bedCount: number): number => {
  const rate = cabinRates.find((c) => c.name === cabinName);
  if (!rate) return 0;
  return rate.baseRate + rate.bedRate * bedCount;
};

// Adds a job to memory
export const addJob = (job: Partial<Job>): Job => {
  const id = uuidv4();
  const createdAt = job.createdAt || new Date();
  const date = job.date || new Date();

  let total = 0;
  let hoursWorked = 0;

  if (job.cabin) {
    total = calculateJobTotal(job.cabin, job.bedCount || 0);
  } else if (job.startTime && job.endTime && job.hourlyRate) {
    const [sh, sm] = job.startTime.split(":").map(Number);
    const [eh, em] = job.endTime.split(":").map(Number);
    const minutesWorked = (eh * 60 + em) - (sh * 60 + sm);
    hoursWorked = Math.max(0, minutesWorked / 60);
    total = parseFloat((hoursWorked * job.hourlyRate).toFixed(2));
  }

  const newJob: Job = {
    id,
    jobType: job.jobType || "custom",
    date,
    createdAt,
    clientName: job.clientName || "",
    address: job.address || "",
    cabin: job.cabin || "",
    bedCount: job.bedCount || 0,
    serviceName: job.serviceName || "",
    startTime: job.startTime || "",
    endTime: job.endTime || "",
    hourlyRate: job.hourlyRate || 0,
    hoursWorked: hoursWorked || job.hoursWorked || 0,
    notes: job.notes || "",
    total,
  };

  jobs.push(newJob);
  return newJob;
};

// Cabin Rate CRUD
export const getCabinRates = (): CabinRate[] => cabinRates;

export const addCabinRate = (rate: Omit<CabinRate, "id">): CabinRate => {
  const newRate: CabinRate = { ...rate, id: uuidv4() };
  cabinRates.push(newRate);
  return newRate;
};

export const updateCabinRate = (updated: CabinRate) => {
  const index = cabinRates.findIndex((r) => r.id === updated.id);
  if (index !== -1) cabinRates[index] = updated;
};

export const deleteCabinRate = (id: string) => {
  const index = cabinRates.findIndex((r) => r.id === id);
  if (index !== -1) cabinRates.splice(index, 1);
};

// Job and Invoice CRUD
export const getJobs = (): Job[] => jobs;

export const getInvoices = (): Invoice[] => invoices;

export const addInvoice = (invoice: Omit<Invoice, "id">): Invoice => {
  const newInvoice: Invoice = {
    ...invoice,
    id: uuidv4(),
  };
  invoices.push(newInvoice);
  return newInvoice;
};

export const getNextInvoiceNumber = (): string => {
  return String(invoices.length + 1).padStart(4, "0");
};

export const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
  const invoice = invoices.find((inv) => inv.id === id);
  if (invoice) {
    invoice.status = status;
  }
};
export const companyInfo = {
  name: "Dammit Bobby LLC",
  address: "23598 Old Highway 160",
  city: "Reeds Spring",
  state: "MO",
  zip: "65737",
  email: "dammitbobby2025@outlook.com",
  phone: "(541) 290-0583"
};
