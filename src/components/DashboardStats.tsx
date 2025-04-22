
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobs, getInvoices } from "@/lib/data";
import { Job, Invoice } from "@/types";

const DashboardStats = () => {
  const [monthlyStats, setMonthlyStats] = useState({
    jobCount: 0,
    revenue: 0,
    bedCount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
  });
  
  const [todayStats, setTodayStats] = useState({
    jobCount: 0,
    revenue: 0,
    bedCount: 0,
  });
  
  useEffect(() => {
    const jobs = getJobs();
    const invoices = getInvoices();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const jobsThisMonth = jobs.filter(job => 
      isWithinInterval(job.date, { start: monthStart, end: monthEnd })
    );
    
    const jobsToday = jobs.filter(job => 
      isWithinInterval(job.date, { start: today, end: tomorrow })
    );
    
    const paidInvoices = invoices.filter(invoice => invoice.status === "paid").length;
    const pendingInvoices = invoices.filter(invoice => invoice.status === "pending").length;
    const overdueInvoices = invoices.filter(invoice => invoice.status === "overdue").length;
    
    setMonthlyStats({
      jobCount: jobsThisMonth.length,
      revenue: jobsThisMonth.reduce((sum, job) => sum + job.total, 0),
      bedCount: jobsThisMonth.reduce((sum, job) => sum + job.bedCount, 0),
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
    });
    
    setTodayStats({
      jobCount: jobsToday.length,
      revenue: jobsToday.reduce((sum, job) => sum + job.total, 0),
      bedCount: jobsToday.reduce((sum, job) => sum + job.bedCount, 0),
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue ({format(new Date(), "MMMM")})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyStats.revenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            From {monthlyStats.jobCount} jobs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Beds Cleaned ({format(new Date(), "MMMM")})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyStats.bedCount.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg {(monthlyStats.jobCount ? monthlyStats.bedCount / monthlyStats.jobCount : 0).toFixed(1)} per job
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenue Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${todayStats.revenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            From {todayStats.jobCount} jobs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Invoice Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyStats.pendingInvoices + monthlyStats.overdueInvoices}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span className="inline-flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              {monthlyStats.paidInvoices} Paid
            </span>
            <span className="inline-flex items-center">
              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
              {monthlyStats.pendingInvoices} Pending
            </span>
            <span className="inline-flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
              {monthlyStats.overdueInvoices} Overdue
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
