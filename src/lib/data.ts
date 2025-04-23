
import { CabinRate, Job, Invoice, CompanyInfo } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const companyInfo: CompanyInfo = {
  name: "Dammit Bobby LLC",
  address: "23588 Old Highway 160",
  city: "Reeds Spring",
  state: "MO",
  zip: "65737",
  email: "dammitbobby2025@outlook.com",
  phone: "(541) 290-0583"
};

// Initial cabin rates based on the proposal data
const cabinRatesData: CabinRate[] = [
  { id: "c1", name: "Cabin 1", baseRate: 60, bedRate: 5 },
  { id: "c2", name: "Cabin 2", baseRate: 60, bedRate: 5 },
  { id: "c4", name: "Cabin 4", baseRate: 60, bedRate: 5 },
  { id: "c5", name: "Cabin 5", baseRate: 60, bedRate: 5 },
  { id: "c6", name: "Cabin 6", baseRate: 60, bedRate: 5 },
  { id: "c7", name: "Cabin 7", baseRate: 75, bedRate: 5 },
  { id: "c3", name: "Cabin 3", baseRate: 85, bedRate: 5 },
  { id: "c8", name: "Cabin 8", baseRate: 95, bedRate: 5 },
  { id: "hourly", name: "Hourly Work", baseRate: 25, bedRate: 0 },
  { id: "other", name: "Other Cleaning", baseRate: 50, bedRate: 0 }
];

// Sample job data
let jobsData: Job[] = [];

// Sample invoice data
let invoicesData: Invoice[] = [];

// Expense categories
export const expenseCategories = [
  "Supplies", 
  "Transportation", 
  "Equipment", 
  "Insurance",
  "Marketing",
  "Utilities",
  "Office",
  "Other"
];

// Expense data structure
export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  receipt?: string;
}

// Initial expense data
let expensesData: Expense[] = [];

// Local Storage Keys
const CABIN_RATES_KEY = "cabin_rates_data";
const JOBS_KEY = "jobs_data";
const INVOICES_KEY = "invoices_data";
const EXPENSES_KEY = "expenses_data";

// Load data from local storage or use initial data
const loadData = () => {
  try {
    const cabinRatesStr = localStorage.getItem(CABIN_RATES_KEY);
    if (cabinRatesStr) {
      cabinRatesData.splice(0, cabinRatesData.length, ...JSON.parse(cabinRatesStr));
    }

    const jobsStr = localStorage.getItem(JOBS_KEY);
    if (jobsStr) {
      const parsedJobs = JSON.parse(jobsStr);
      jobsData = parsedJobs.map((job: any) => ({
        ...job,
        date: new Date(job.date),
        createdAt: new Date(job.createdAt),
      }));
    }

    const invoicesStr = localStorage.getItem(INVOICES_KEY);
    if (invoicesStr) {
      const parsedInvoices = JSON.parse(invoicesStr);
      invoicesData = parsedInvoices.map((invoice: any) => ({
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
    
    const expensesStr = localStorage.getItem(EXPENSES_KEY);
    if (expensesStr) {
      const parsedExpenses = JSON.parse(expensesStr);
      expensesData = parsedExpenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
      }));
    }
  } catch (error) {
    console.error("Error loading data from local storage:", error);
  }
};

// Save data to local storage
const saveCabinRates = () => {
  localStorage.setItem(CABIN_RATES_KEY, JSON.stringify(cabinRatesData));
};

const saveJobs = () => {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobsData));
};

const saveInvoices = () => {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoicesData));
};

const saveExpenses = () => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expensesData));
};

// Load data when the module is imported
loadData();

// Cabin Rates CRUD operations
export const getCabinRates = (): CabinRate[] => {
  return [...cabinRatesData];
};

export const getCabinRateByName = (name: string): CabinRate | undefined => {
  return cabinRatesData.find(rate => rate.name === name);
};

export const addCabinRate = (cabinRate: Omit<CabinRate, "id">): CabinRate => {
  const newCabinRate = { ...cabinRate, id: uuidv4() };
  cabinRatesData.push(newCabinRate);
  saveCabinRates();
  return newCabinRate;
};

export const updateCabinRate = (cabinRate: CabinRate): CabinRate => {
  const index = cabinRatesData.findIndex(rate => rate.id === cabinRate.id);
  if (index !== -1) {
    cabinRatesData[index] = cabinRate;
    saveCabinRates();
  }
  return cabinRate;
};

export const deleteCabinRate = (id: string): void => {
  const index = cabinRatesData.findIndex(rate => rate.id === id);
  if (index !== -1) {
    cabinRatesData.splice(index, 1);
    saveCabinRates();
  }
};

// Job CRUD operations
export const getJobs = (): Job[] => {
  return [...jobsData];
};

export const getJob = (id: string): Job | undefined => {
  return jobsData.find(job => job.id === id);
};

export const addJob = (jobData: Omit<Job, "id" | "createdAt">): Job => {
  const newJob: Job = {
    ...jobData,
    id: uuidv4(),
    createdAt: new Date(),
  };
  jobsData.push(newJob);
  saveJobs();
  return newJob;
};

export const updateJob = (job: Job): Job => {
  const index = jobsData.findIndex(j => j.id === job.id);
  if (index !== -1) {
    jobsData[index] = job;
    saveJobs();
    
    // Also update this job in any invoices that contain it
    invoicesData.forEach(invoice => {
      const jobIndex = invoice.jobs.findIndex(j => j.id === job.id);
      if (jobIndex !== -1) {
        invoice.jobs[jobIndex] = job;
        // Recalculate invoice total
        invoice.total = invoice.jobs.reduce((sum, j) => sum + j.total, 0);
      }
    });
    saveInvoices();
  }
  return job;
};

export const deleteJob = (id: string): void => {
  const index = jobsData.findIndex(job => job.id === id);
  if (index !== -1) {
    jobsData.splice(index, 1);
    saveJobs();
    
    // Also remove this job from any invoices that contain it
    invoicesData.forEach(invoice => {
      invoice.jobs = invoice.jobs.filter(job => job.id !== id);
      // Recalculate invoice total
      invoice.total = invoice.jobs.reduce((sum, job) => sum + job.total, 0);
    });
    saveInvoices();
  }
};

export const calculateJobTotal = (cabinName: string, bedCount: number): number => {
  const cabinRate = cabinRatesData.find(rate => rate.name === cabinName);
  if (!cabinRate) return 0;
  
  return cabinRate.baseRate + (bedCount > 1 ? (bedCount - 1) * cabinRate.bedRate : 0);
};

// Invoice CRUD operations
export const getInvoices = (): Invoice[] => {
  return [...invoicesData];
};

export const getInvoice = (id: string): Invoice | undefined => {
  return invoicesData.find(invoice => invoice.id === id);
};

export const getNextInvoiceNumber = (): string => {
  const year = new Date().getFullYear().toString().substring(2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
  
  const lastInvoice = [...invoicesData]
    .sort((a, b) => b.number.localeCompare(a.number))
    .find(invoice => invoice.number.startsWith(`${year}${month}`));
  
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.number.substring(4)) || 0;
    return `${year}${month}${(lastNumber + 1).toString().padStart(3, "0")}`;
  }
  
  return `${year}${month}001`;
};

export const addInvoice = (invoiceData: Omit<Invoice, "id">): Invoice => {
  const newInvoice: Invoice = {
    ...invoiceData,
    id: uuidv4(),
  };
  invoicesData.push(newInvoice);
  saveInvoices();
  return newInvoice;
};

export const updateInvoice = (invoice: Invoice): Invoice => {
  const index = invoicesData.findIndex(inv => inv.id === invoice.id);
  if (index !== -1) {
    invoicesData[index] = invoice;
    saveInvoices();
  }
  return invoice;
};

export const updateInvoiceStatus = (id: string, status: "pending" | "paid" | "overdue"): Invoice | undefined => {
  const invoice = invoicesData.find(inv => inv.id === id);
  if (invoice) {
    invoice.status = status;
    saveInvoices();
    return invoice;
  }
  return undefined;
};

export const deleteInvoice = (id: string): void => {
  const index = invoicesData.findIndex(invoice => invoice.id === id);
  if (index !== -1) {
    invoicesData.splice(index, 1);
    saveInvoices();
  }
};

// Expense CRUD operations
export const getExpenses = (): Expense[] => {
  return [...expensesData];
};

export const getExpense = (id: string): Expense | undefined => {
  return expensesData.find(expense => expense.id === id);
};

export const addExpense = (expenseData: Omit<Expense, "id">): Expense => {
  const newExpense: Expense = {
    ...expenseData,
    id: uuidv4(),
  };
  expensesData.push(newExpense);
  saveExpenses();
  return newExpense;
};

export const updateExpense = (expense: Expense): Expense => {
  const index = expensesData.findIndex(e => e.id === expense.id);
  if (index !== -1) {
    expensesData[index] = expense;
    saveExpenses();
  }
  return expense;
};

export const deleteExpense = (id: string): void => {
  const index = expensesData.findIndex(expense => expense.id === id);
  if (index !== -1) {
    expensesData.splice(index, 1);
    saveExpenses();
  }
};

// Financial reporting
export const calculateMonthlyProfit = (month: number, year: number): { income: number, expenses: number, profit: number } => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  // Calculate income from jobs
  const monthJobs = jobsData.filter(job => 
    job.date >= startDate && 
    job.date <= endDate
  );
  
  const income = monthJobs.reduce((sum, job) => sum + job.total, 0);
  
  // Calculate expenses
  const monthExpenses = expensesData.filter(expense => 
    expense.date >= startDate && 
    expense.date <= endDate
  );
  
  const expenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return {
    income,
    expenses,
    profit: income - expenses
  };
};
