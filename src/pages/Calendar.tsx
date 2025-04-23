
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/data";
import JobCalendar from "@/components/JobCalendar";

const CalendarPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const jobs = getJobs();
  
  const refreshJobs = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your jobs by date
          </p>
        </div>
        
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/jobs/new">Log New Job</Link>
        </Button>
      </div>
      
      <JobCalendar jobs={jobs} />
    </div>
  );
};

export default CalendarPage;
