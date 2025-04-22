
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getJobs, getInvoices } from "@/lib/data";
import DashboardStats from "@/components/DashboardStats";
import JobList from "@/components/JobList";
import InvoiceList from "@/components/InvoiceList";

const Dashboard = () => {
  const jobs = getJobs();
  const invoices = getInvoices();
  
  // Sort jobs by date, most recent first
  const recentJobs = [...jobs].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Find upcoming jobs (today and future)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const upcomingJobs = recentJobs.filter(job => job.date >= today);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your cleaning jobs and invoices
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link to="/jobs/new">New Job</Link>
          </Button>
          <Button asChild>
            <Link to="/invoices/new">New Invoice</Link>
          </Button>
        </div>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <JobList 
          jobs={upcomingJobs} 
          title="Upcoming Jobs"
          description="Jobs scheduled for today and future dates"
          limit={5}
        />
        
        <InvoiceList 
          invoices={invoices}
          title="Recent Invoices"
          limit={5}
        />
      </div>
    </div>
  );
};

export default Dashboard;
